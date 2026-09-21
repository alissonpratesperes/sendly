import * as z from 'zod';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';

import { Pair } from '../services/baileys.service';
import Toast from '../../../shared/components/toast/screens/Toast';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import { FormProps } from '../../../shared/interfaces/formProps.interface';
import * as Styled from '../../../shared/components/drawer/styles/drawer.style';
import { CreatePairingCodeCommandDto } from '../dtos/createPairingCodeCommand.dto';
import { BaileysFormData, BaileysFormSchema } from '../schemas/baileysFormSchema.schema';
import { getAuthenticationStorage } from '../../../shared/utils/authenticationStorage.util';

export const BaileysForm: React.FC<FormProps<BaileysFormData>> = ({ initialValues, onCancel, onSubmit, onLoadingChange, onPairingSuccess, }) => {
    const [formData, setFormData] = useState<BaileysFormData>({ phone: "", country: "BR" });

    const { userInformation } = getAuthenticationStorage();

    const targetCompanyId = userInformation?.company?.id;

    const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = changeEvent.target;

        if (name === "phone") {
            const rawDigits = value.replace(/\D/g, "");
            const formattedPhone = new AsYouType("BR").input(rawDigits);

            setFormData((previous) => ({
                ...previous,
                phone: formattedPhone,
            }));

            return;
        }

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }
    const handleSubmit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();

        if (!targetCompanyId) {
            toast.error("Empresa não localizada");

            return;
        }

        onLoadingChange(true);

        try {
            const validatedFormData = BaileysFormSchema.parse(formData);
            const parsedPhone = parsePhoneNumberFromString(validatedFormData.phone, "BR");

            if (!parsedPhone || !parsedPhone.isValid()) {
                throw new Error("O telefone informado é inválido");
            }

            const normalizedPhone = parsedPhone.number;
            const command: CreatePairingCodeCommandDto = { phone: normalizedPhone, }
            const response = await Pair({ id: targetCompanyId }, command);

            toast.success("Código de pareamento gerado com sucesso");

            if (onPairingSuccess && response?.pairingCode) {
                onPairingSuccess(response.pairingCode);
            }

            onSubmit();
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                toast.error(<Toast errors={error.issues} />);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Não é possível prosseguir com a solicitação");
            }
        } finally {
            onLoadingChange(false);
        }
    }

    useEffect(() => {
        if (initialValues?.phone) {
            const parsedContactPhone = parsePhoneNumberFromString(initialValues.phone, "BR");

            setFormData({ phone: parsedContactPhone?.formatNational() ?? initialValues.phone, country: "BR", });
        } else {
            setFormData({ phone: "", country: "BR" });
        }
    }, [ initialValues ]);

    return (
        <Styled.Form id="baileys-form" onSubmit={ handleSubmit }>
            <Styled.FieldWrapper>
                <Styled.Label htmlFor="phone"> Telefone </Styled.Label>

                <Styled.Input id="phone" name="phone" placeholder="Digite o número do WhatsApp (com DDD)" value={ formData.phone } onChange={ handleChange } />
            </Styled.FieldWrapper>
        </Styled.Form>
    );
}
