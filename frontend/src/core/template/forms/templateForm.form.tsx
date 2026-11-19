import * as z from 'zod';
import { toast } from 'react-toastify';
import React, { useState, useEffect, useRef, Fragment } from 'react';

import * as G from '../../../shared/styles/global.style';
import * as S from '../../../shared/components/drawer/styles/drawer.style';

import { Create, Update } from '../services/template.service';
import { Toast } from '../../../shared/components/toast/screens/Toast';
import { FormProps } from '../../../shared/interfaces/formProps.interface';
import { CreateTemplateCommandDto } from '../dtos/createTemplateCommand.dto';
import { UpdateTemplateCommandDto } from '../dtos/updateTemplateCommand.dto';
import { Uploader } from '../../../shared/components/uploader/screens/Uploader';
import { TemplateContentFields } from '../interfaces/templateContentFields.interface';
import { TemplateFormData, TemplateFormSchema } from '../schemas/templateFormSchema.schema';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';
import { WhatsAppPreview } from '../../../shared/components/whatsAppPreview/screens/WhatsAppPreview';

export const TemplateForm: React.FC<FormProps<TemplateFormData>> = ({ initialValues, disabled = false, onSubmit, onLoadingChange, }) => {
    const { userInformation } = getAuthenticationStorage();

    const [showPreview, setShowPreview] = useState(false);
    const [closingPreview, setClosingPreview] = useState(false);
    const [templateImage, setTemplateImage] = useState<File | undefined>();
    const [existingImage, setExistingImage] = useState<string | undefined>();
    const [activeField, setActiveField] = useState<keyof TemplateContentFields>("header");
    const [formData, setFormData] = useState<TemplateFormData>({ companyId: 0, name: "", content: { body: [], }, });
    const [templateFields, setTemplateFields] = useState<TemplateContentFields>({ header: "", body: "", footer: "", });

    const templateFormInputRefs = { header: useRef<HTMLInputElement>(null), body: useRef<HTMLTextAreaElement>(null), footer: useRef<HTMLInputElement>(null), };
    const hasReachedVariableLimit = Object.values(templateFields).every(field => field.includes("{{name}}"));

    const handleTogglePreview = () => {
        if (showPreview) {
            setClosingPreview(true);

            return;
        }

        setShowPreview(true);
        setClosingPreview(false);
    }
    const handleInsertTemplateVariable = () => {
        const currentValue = templateFields[activeField];

        if (currentValue.includes("{{name}}")) {
            return;
        }

        setTemplateFields(previous => ({
            ...previous,

            [activeField]: currentValue + "{{name}}",
        }));

        requestAnimationFrame(() => {
            templateFormInputRefs[activeField].current?.focus();
        });
    }
    const handleChange = <T,>(changeEvent: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, setState: React.Dispatch<React.SetStateAction<T>>) => {
        const { name, value } = changeEvent.target;

        setState(previous => ({
            ...previous,

            [name]: value,
        }));
    }
    const buildFormData = (command: CreateTemplateCommandDto | UpdateTemplateCommandDto, image?: File): FormData => {
        const formData = new FormData();

        formData.append("name", command.name ?? "");
        formData.append("content", command.content ?? "");

        if ("companyId" in command) {
            formData.append("companyId", String(command.companyId));
        }
        if (image instanceof File) {
            formData.append("image", image);
        }

        return formData;
    }
    const handleSubmit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();

        onLoadingChange(true);

        try {
            const existingImageBlock = initialValues?.content.body.find(
                block => block.type === "image"
            );

            const imageBlock = templateImage
                ? {
                    type: "image" as const,
                    path: "",
                }
                : existingImage
                    ? existingImageBlock
                    : undefined;
            const content = {
                ...(templateFields.header && {
                    header: {
                        title: templateFields.header,
                    },
                }),

                body: [
                    {
                        type: "text" as const,
                        text: templateFields.body,
                    },

                    ...(imageBlock ? [imageBlock] : []),
                ],

                ...(templateFields.footer && {
                    footer: {
                        text: templateFields.footer,
                    },
                }),
            }
            const validatedFormData = TemplateFormSchema.parse({
                ...formData,
                content,
            });

            if (initialValues?.id === undefined) {
                const command: CreateTemplateCommandDto = {
                    companyId: userInformation?.company.id ?? 0,
                    name: validatedFormData.name,
                    content: JSON.stringify(validatedFormData.content),
                }

                await Create(buildFormData(command, templateImage));

                toast.success("Template criado com sucesso");
            } else {
                const command: UpdateTemplateCommandDto = {
                    name: validatedFormData.name,
                    content: JSON.stringify(validatedFormData.content),
                }

                await Update({ id: initialValues.id },  buildFormData(command, templateImage));

                toast.success("Template editado com sucesso");
            }

            onSubmit();
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                toast.error(<Toast errors={ error.issues }/>);
            } else {
                toast.error("Não é possível prosseguir com a solicitação");
            }
        } finally {
            onLoadingChange(false);
        }
    }

    useEffect(() => {
        if (initialValues) {
            setFormData(initialValues);
            setTemplateFields({
                header: initialValues.content.header?.title ?? "",
                body: initialValues.content.body.find(block => block.type === "text")?.text ?? "",
                footer: initialValues.content.footer?.text ?? "",
            });
            setExistingImage(initialValues.content.body.find(block => block.type === "image")?.path);
            setTemplateImage(undefined);
        } else {
            setFormData({ ...formData, });
            setTemplateFields({ ...templateFields, });
        }
    }, [ initialValues, ]);

    return (
        <Fragment>
            { showPreview && ( <WhatsAppPreview header={ templateFields.header } body={ templateFields.body } footer={ templateFields.footer } image={ templateImage ?? existingImage } isClosing={ closingPreview } onAnimationEnd={ () => { if (closingPreview) { setShowPreview(false); setClosingPreview(false); } } }/> ) }

            <S.Form id="template-form" onSubmit={ handleSubmit }>
                <S.FieldWrapper>
                    <G.Label htmlFor="name"> Nome </G.Label>

                    <S.Input id="name" name="name" placeholder="Digite o nome do template" value={ formData.name } onChange={ (event) => handleChange(event, setFormData) } disabled={ disabled }/>
                </S.FieldWrapper>

                <S.Fieldset>
                    <S.Legend>
                        <G.ButtonsContainer>
                            <S.WhatsAppPreviewToggleButton type="button" onClick={ handleTogglePreview } $showPreview={ showPreview }>
                                { !showPreview ? <S.WhatsAppPreviewToggleButtonPlayIcon/> : <S.WhatsAppPreviewToggleButtonPauseIcon/> }

                                <S.WhatsAppPreviewToggleButtonText> Preview </S.WhatsAppPreviewToggleButtonText>
                            </S.WhatsAppPreviewToggleButton>

                            { !disabled && (<S.VariableTipButton $disabled={ hasReachedVariableLimit } disabled={ disabled || hasReachedVariableLimit } type="button" onClick={ handleInsertTemplateVariable }> <S.VariableTipButtonIcon/> <S.VariableTipButtonText> { "{{name}}" } </S.VariableTipButtonText> </S.VariableTipButton>) }
                        </G.ButtonsContainer>
                    </S.Legend>

                    <S.FieldWrapper>
                        <G.Label htmlFor="header"> Cabeçalho </G.Label>

                        <S.Input id="header" name="header" placeholder="Digite o cabeçalho do template" value={ templateFields.header } onChange={ (event) => handleChange(event, setTemplateFields) } disabled={ disabled } ref={ templateFormInputRefs.header } onFocus={ () => setActiveField("header") }/>
                    </S.FieldWrapper>
                    <S.FieldWrapper>
                        <S.TextareaWrapper>
                            <S.Textarea id="body" name="body" placeholder="Digite o corpo do template" value={ templateFields.body } onChange={ (event) => handleChange(event, setTemplateFields) } disabled={ disabled } ref={ templateFormInputRefs.body } onFocus={ () => setActiveField("body") }/>
                        </S.TextareaWrapper>
                    </S.FieldWrapper>
                    <S.FieldWrapper>
                        <G.Label htmlFor="footer"> Rodapé </G.Label>

                        <S.Input id="footer" name="footer" placeholder="Digite o rodapé do template" value={ templateFields.footer } onChange={ (event) => handleChange(event, setTemplateFields) } disabled={ disabled } ref={ templateFormInputRefs.footer } onFocus={ () => setActiveField("footer") }/>
                    </S.FieldWrapper>

                    <Uploader value={ templateImage } existingImage={ existingImage } onRemoveExistingImage={ () => { setExistingImage(undefined); } } onChange={ (file) => { if (file instanceof File) { setTemplateImage(file); } else { setTemplateImage(undefined); } } } blockRemove={ disabled }/>
                </S.Fieldset>
            </S.Form>
        </Fragment>
    );
}
