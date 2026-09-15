import Slider from 'react-slick';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { PenLine, Trash2, MoveLeft, Maximize2, ChevronLeft, ChevronRight, X, Download } from 'lucide-react';

import { CommercialForm } from '../forms/CommercialForm';
import { CommercialDTO } from '../dtos/CommercialDTO.dto';
import { ActionDTO } from '../../action/dtos/ActionDTO.dto';
import * as CommercialStyled from '../styles/Commercial.style';
import * as DetailStyled from '../styles/CommercialDetails.style';
import { ReadById, Delete } from '../services/Commercial.service';
import Modal from '../../../shared/components/modal/screens/Modal';
import { ReadById as ReadAction } from '../../action/services/Action.service';
import { Drawer } from '../../../shared/components/drawer/screens/Drawer';
import { UploaderItemType } from '../../../shared/components/uploader/types/uploaderItemType.type';
import { formatImagesWithBase64ToUploaderUtil } from '../../../shared/utils/formatImagesWithBase64ToUploaderUtil.util';

const CommercialDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [action, setAction] = useState<ActionDTO>();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [commercial, setCommercial] = useState<CommercialDTO | null>(null);
    const [selectedActionId, setSelectedActionId] = useState<number | null>(null);


    const formattedImages: UploaderItemType[] = formatImagesWithBase64ToUploaderUtil(commercial?.imagens ?? []);
    const imageUrls = commercial?.imagens?.filter(img => typeof img !== 'string' && 'urlDownload' in img).map(img => (img as any).urlDownload).filter(Boolean) ?? [];
    const PrevArrow = (props: any) => { return (<DetailStyled.Arrow onClick={props.onClick} data-type="slick-prev"> <ChevronLeft size={24} /> </DetailStyled.Arrow>); };
    const NextArrow = (props: any) => { return (<DetailStyled.Arrow onClick={props.onClick} data-type="slick-next">  <ChevronRight size={24} /> </DetailStyled.Arrow>); };

    const handleReadById = useCallback(async () => {
        try {

            if (!id) {
                toast.error(`Ação Comercial não encontrada`);

                return null;
            };

            const response = await ReadById(Number(id));
            const actionResponse = await ReadAction(response.tipoAcaoId);

            setCommercial(response);
            setAction(actionResponse);
        } catch (error) {
            toast.error(`Erro ao acessar os detalhes da Ação Comercial: ${error}`);
        } finally {
        };
    }, [id ]);
    const openImageModal = (index: number) => {
        const maxIndex = (imageUrls.length - 1);

        setModalImageIndex(index > maxIndex ? maxIndex : index);
        setIsImageModalOpen(true);
    };
    const closeImageModal = () => {
        setIsImageModalOpen(false);
    };
    const handleConfirmDelete = async () => {
        if (selectedActionId === null) {
            return;
        };

        try {
            await Delete(selectedActionId);

            setIsImageModalOpen(false);

            navigate('/commercial-actions');
        } catch (error) {
            toast.error(`Erro ao excluir Ação Comercial: ${error}`);
        };
    };

    useEffect(() => {
        handleReadById();
    }, [handleReadById]);

    return (
        <>
            <CommercialStyled.HeaderWrapper>
                <CommercialStyled.GoBackButton onClick={() => navigate(-1)}>
                    <MoveLeft size={20} />

                    <CommercialStyled.GoBackButtonLabel> Voltar para ações comerciais </CommercialStyled.GoBackButtonLabel>
                </CommercialStyled.GoBackButton>
            </CommercialStyled.HeaderWrapper>

            <DetailStyled.PageWrapper>
                <DetailStyled.Header>
                    <DetailStyled.LabelRow>
                        <DetailStyled.LightLabel> Detalhe | </DetailStyled.LightLabel>

                        <DetailStyled.BoldLabel> TA: {action?.nome} </DetailStyled.BoldLabel>
                    </DetailStyled.LabelRow>

                    <DetailStyled.ActionButtons>
                        <DetailStyled.DeleteButton onClick={() => { setSelectedActionId(Number(id)); setIsDeleteModalOpen(true); }}> <Trash2 size={20} /> </DetailStyled.DeleteButton>

                        <DetailStyled.EditButton onClick={() => setDrawerOpen(true)}>
                            <PenLine size={20} />

                            Editar
                        </DetailStyled.EditButton>
                    </DetailStyled.ActionButtons>
                </DetailStyled.Header>

                <DetailStyled.InfoGrid>
                    <DetailStyled.InfoItem>
                        <DetailStyled.InfoItemTitle> Data </DetailStyled.InfoItemTitle>

                        <DetailStyled.InfoItemSubtitle> {commercial?.data ? format(new Date(commercial.data), 'dd/MM/yyyy') : "-"} </DetailStyled.InfoItemSubtitle>
                    </DetailStyled.InfoItem>
                    <DetailStyled.InfoItem>
                        <DetailStyled.InfoItemTitle> Rede </DetailStyled.InfoItemTitle>

                        <DetailStyled.InfoItemSubtitle> {commercial?.redeNome ?? "-"} </DetailStyled.InfoItemSubtitle>
                    </DetailStyled.InfoItem>
                    <DetailStyled.InfoItem>
                        <DetailStyled.InfoItemTitle> Loja </DetailStyled.InfoItemTitle>

                        <DetailStyled.InfoItemSubtitle> {commercial?.lojaApelido ?? "-"} </DetailStyled.InfoItemSubtitle>
                    </DetailStyled.InfoItem>
                    <DetailStyled.InfoItem>
                        <DetailStyled.InfoItemTitle> Local </DetailStyled.InfoItemTitle>

                        <DetailStyled.InfoItemSubtitle> {commercial?.local ?? "-"} </DetailStyled.InfoItemSubtitle>
                    </DetailStyled.InfoItem>
                    <DetailStyled.InfoItem>
                        <DetailStyled.InfoItemTitle> Cat. Produto </DetailStyled.InfoItemTitle>

                        <DetailStyled.InfoItemSubtitle> {commercial?.categoriaProdutoNome ?? "-"} </DetailStyled.InfoItemSubtitle>
                    </DetailStyled.InfoItem>
                    <DetailStyled.InfoItem>
                        <DetailStyled.InfoItemTitle> Produto </DetailStyled.InfoItemTitle>

                        <DetailStyled.InfoItemSubtitle> {commercial?.produtoNome ?? "-"} </DetailStyled.InfoItemSubtitle>
                    </DetailStyled.InfoItem>
                </DetailStyled.InfoGrid>

                <DetailStyled.Section>
                    <DetailStyled.SectionLabel>
                        <DetailStyled.SectionTitle> Galeria de fotos <DetailStyled.InfoItemTitle> ({commercial?.imagens.length}) </DetailStyled.InfoItemTitle> </DetailStyled.SectionTitle>

                        <Maximize2 size={20} color='#00355D' style={{ cursor: 'pointer' }} onClick={() => openImageModal(0)} />
                    </DetailStyled.SectionLabel>

                    <DetailStyled.ImagesGridWrapper>
                        {imageUrls.map((url, index) => (
                            <DetailStyled.ImageWrapper key={index} onClick={() => openImageModal(index)}>
                                <DetailStyled.ImageContent src={url} alt={`Imagem ${index + 1}`} />

                                <DetailStyled.ImagemHoverLabel> Clique para visualizar </DetailStyled.ImagemHoverLabel>
                            </DetailStyled.ImageWrapper>
                        ))}
                    </DetailStyled.ImagesGridWrapper>

                    {isImageModalOpen && (
                        <DetailStyled.BackdropImageSlide>
                            <DetailStyled.BackdropImageSlideButton onClick={closeImageModal}> <X size={20} /> </DetailStyled.BackdropImageSlideButton>

                            <DetailStyled.BackdropImageCarousel>
                                <Slider fade={true} dots={false} arrows={true} initialSlide={modalImageIndex} infinite={true} slidesToShow={1} slidesToScroll={1} prevArrow={<PrevArrow />} nextArrow={<NextArrow />} afterChange={(index) => setModalImageIndex(index)}>
                                    {imageUrls.map((url, index) => (
                                        <DetailStyled.ImageSlideContainer key={index}>
                                            <DetailStyled.CarouselImage src={url} alt={`Imagem ${index + 1}`} />

                                            <DetailStyled.DownloadButton href={url} download={`imagem-${index + 1}.jpg`} target="_blank" rel="noopener noreferrer">
                                                <Download size={20} />

                                                Baixar foto
                                            </DetailStyled.DownloadButton>
                                        </DetailStyled.ImageSlideContainer>
                                    ))}
                                </Slider>
                            </DetailStyled.BackdropImageCarousel>
                        </DetailStyled.BackdropImageSlide>
                    )}
                </DetailStyled.Section>
            </DetailStyled.PageWrapper>

            <Modal isOpen={isDeleteModalOpen} entityName={action?.nome ?? "-"} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} />

            <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title={'Editar ação'}>
                {commercial && (
                    <CommercialForm
                        initialValues={{
                            tipoAcaoId: commercial.tipoAcaoId ?? 0,
                            data: commercial.data ?? new Date(),
                            categoriaProdutoId: commercial.categoriaProdutoId ?? 0,
                            imagens: formattedImages,
                            redeId: commercial.redeId,
                            lojaId: commercial.lojaId,
                            local: commercial.local ?? "",
                            produtoId: commercial.produtoId,
                            id: commercial.id
                        }}
                        onCancel={() => setDrawerOpen(false)}
                        onSubmit={async () => { await handleReadById(); setDrawerOpen(false); }}
                    />
                )}
            </Drawer>
        </>
    );
};

export default CommercialDetails;