import * as z from 'zod';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

import { Create, Update } from '../services/template.service';
import Toast from '../../../shared/components/toast/screens/Toast';
import { FormProps } from '../../../shared/interfaces/formProps.interface';
import Uploader from '../../../shared/components/uploader/screens/Uploader';
import { CreateTemplateCommandDto } from '../dtos/createTemplateCommand.dto';
import { UpdateTemplateCommandDto } from '../dtos/updateTemplateCommand.dto';
import * as Styled from '../../../shared/components/drawer/styles/drawer.style';
import { TemplateContentFields } from '../interfaces/templateContentFields.interface';
import { TemplateFormData, TemplateFormSchema } from '../schemas/templateFormSchema.schema';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';

export const TemplateForm: React.FC<FormProps<TemplateFormData>> = ({ initialValues, onSubmit, onLoadingChange, }) => {
    const { userInformation } = getAuthenticationStorage();

    const [templateImage, setTemplateImage] = useState<File | undefined>();
    const [formData, setFormData] = useState<TemplateFormData>({ companyId: 0, name: "", content: { body: [], }, });
    const [templateFields, setTemplateFields] = useState<TemplateContentFields>({ header: "", body: "", footer: "", });

    const handleChange = <T,>(changeEvent: React.ChangeEvent<HTMLInputElement>, setState: React.Dispatch<React.SetStateAction<T>>) => {
        const { name, value } = changeEvent.target;

        setState(previous => ({
            ...previous,

            [name]: value,
        }));
    }
    const buildFormData = (command: CreateTemplateCommandDto | UpdateTemplateCommandDto, image?: File): FormData => {
        const formData = new FormData();

        formData.append("name", command.name);
        formData.append("content", command.content);

        if ("companyId" in command) {
            formData.append("companyId", String(command.companyId));
        }
        if (image) {
            formData.append("image", image);
        }

        return formData;
    }
    const handleSubmit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();

        onLoadingChange(true);

        try {
            const content = {
                ...(templateFields.header && {
                    header: {
                        title: templateFields.header,
                    },
                }),

                body: [{
                    type: "text" as const,
                    text: templateFields.body,
                }],

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
                toast.error(<Toast errors={ error.issues } />);
            } else {
                toast.error("Não é possível prosseguir com a solicitação");
            }
        } finally {
            onLoadingChange(false);
        }
    }

    useEffect(() => {
        if (initialValues) {
            setFormData({
                id: initialValues.id,
                companyId: initialValues.companyId,
                name: initialValues.name,
                content: initialValues.content,
            });
            setTemplateFields({
                header: initialValues.content.header?.title ?? "",
                body: initialValues.content.body.find(block => block.type === "text")?.text ?? "",
                footer: initialValues.content.footer?.text ?? "",
            });
        } else {
            setFormData({ companyId: 0, name: "", content: { body: [], }, });
            setTemplateFields({ header: "", body: "", footer: "", });
        }
    }, [ initialValues ]);

    return (
        <Styled.Form id="template-form" onSubmit={ handleSubmit }>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="name"> Nome </Styled.Label>

                <Styled.Input id="name" name="name" placeholder="Digite o nome do template" value={ formData.name } onChange={ (event) => handleChange(event, setFormData) } />
            </Styled.FieldWrapper>

            <Styled.FieldWrapper>
                <Styled.Label htmlFor="header"> Cabeçalho </Styled.Label>

                <Styled.Input id="header" name="header" placeholder="Digite o cabeçalho do template" value={ templateFields.header } onChange={ (event) => handleChange(event, setTemplateFields) } />
            </Styled.FieldWrapper>

            <Styled.FieldWrapper>
                <Styled.Label htmlFor="body"> Corpo </Styled.Label>

                <Styled.Input id="body" name="body" placeholder="Digite o corpo do template" value={ templateFields.body } onChange={ (event) => handleChange(event, setTemplateFields) } />
            </Styled.FieldWrapper>

            <Uploader value={ templateImage } onChange={ setTemplateImage } />

            <Styled.FieldWrapper>
                <Styled.Label htmlFor="footer"> Rodapé </Styled.Label>

                <Styled.Input id="footer" name="footer" placeholder="Digite o rodapé do template" value={ templateFields.footer } onChange={ (event) => handleChange(event, setTemplateFields) } />
            </Styled.FieldWrapper>
        </Styled.Form>
    );
}
