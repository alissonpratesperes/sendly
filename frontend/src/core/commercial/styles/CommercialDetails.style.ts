import styled from 'styled-components';

export const Arrow = styled.div<{ 'data-type'?: string }>`
  height: 36px;
  width: 36px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #FF734A; 
  border-radius: 50%;
  color: #FFFFFF;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer; 
  z-index: 3;

    &[data-type~="slick-prev"] {
      left: -15px; 
    }

    &[data-type~="slick-next"] {
      right: -15px;
    }
`;

export const PageWrapper = styled.div`
  margin: 0px auto 0px auto; 
  width: 100%;
  font-family: 'Lato';
  color: #171719;
`;

export const Header = styled.div`
  margin-bottom: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const LabelRow = styled.div`
  height: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
`;

export const BoldLabel = styled.p`
  font-family: 'Lato';
  font-weight: 700;
  font-size: 24px;
  color: #171719;
`;

export const LightLabel = styled.p`
  font-family: 'Lato';
  font-weight: 400;
  font-size: 24px;
  color: #171719;
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content:center;
  gap: 10px;
`;

export const DeleteButton = styled.button`
  height: 40px;
  width: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #A51C1C;
  background-color: transparent; 
  border-radius: 8px;
  border: none;
  border: 1px solid #D3D2D9;
  cursor: pointer;
`;

export const EditButton = styled.button`
  height: 40px;
  width: 106px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  font-family: 'Lato';
  font-weight: 700;
  font-size: 16px;  
  color: #FFFFFF;
  background-color: #00355D;
  border-radius: 8px;
  border: none;
  cursor: pointer; 
`;

export const InfoGrid = styled.div`
  margin: 20px 0px 20px 0px;
  padding: 10px 10px 10px 67px;
  height: 117px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 40px;
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 4px 9px rgba(152, 160, 180, 0.25); 
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
  position: relative; 

    &:not(:first-child)::before {
      margin-right: 24px;
      height: 47px;
      width: 1px;
      content: '';
      position: absolute;
      left: 0px;
      top: 4px;
      bottom: 4px;
      background-color: #CAC4D0;
    }

    &:not(:first-child) {
      padding-left: 24px;
    }
`;

export const InfoItemTitle = styled.span`
  line-height: 24px;
  font-family: 'Inter';
  font-weight: 300;
  font-size: 16px;  
  color: #4B4B4B;
`;

export const InfoItemSubtitle = styled.strong`
  line-height: 24px;
  font-family: 'Inter';
  font-weight: 600;
  font-size: 16px;  
  color: #4B4B4B;
`;

export const Section = styled.div`
  margin-top: 30px;
  padding: 36px 36px 36px 36px; 
  width: 100%;
  max-width: 100%;
  background-color: #FFFFFF;
  border-radius: 8px;
  box-shadow: 0px 4px 9px rgba(152, 160, 180, 0.25); 
`;

export const SectionLabel = styled.div`
  padding-right: 35px;
  display: flex;
  flex-direction: row;
  align-citems: center;
  justify-content: space-between;
`;

export const SectionTitle = styled.h3`
  margin-bottom: 30px;
  line-height: 24px;
  font-family: 'Inter';
  font-weight: 600;
  font-size: 20px;  
  color: #4B4B4B;
`;

export const SliderWrapper = styled.div`
  margin: 0px auto 0px auto;
  padding: 36px 36px 36px 32px; 
  height: 100%;
  width: 100%;

    .slick-track {
      display: flex !important;
      align-items: flex-start !important;
      justify-content: center !important;
      height: auto !important;
    }

    .slick-slide {
      display: block !important;
      width: 100% !important;
    } 
`;

export const ImagesGridWrapper = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

export const ImageContent = styled.img`
  height: 100%;
  width: 100%;
  display: block;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
`;

export const ImagemHoverLabel = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 24px;
  font-family: 'Inter';
  font-weight: 500;
  font-size: 20px;
  color: #FFFFFF;
  opacity: 0;
  pointer-events: none; 
  transition: opacity 0.3s ease;
  z-index: 2;
`;

export const ImageWrapper = styled.div`
  width: 100%;
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;

    &:hover ${ImageContent} {
      transform: scale(1.05);
    }

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0;
        border-radius: 8px;
        transition: opacity 0.3s ease;
        z-index: 1;
      }
 
      &:hover::after {
        opacity: 1;
      } 

        &:hover ${ImagemHoverLabel} {
          opacity: 1;
        }
`;

export const BackdropImageSlide = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0px;
  left: 0px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  overflow: visible; 
  z-index: 9999;
`;

export const BackdropImageSlideButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  color: #FFFFFF;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
`;

export const BackdropImageCarouselWrapper = styled.div`
  position: relative;
  width: 1000px;
  height: 664.74px;
  overflow: visible;

    @media (max-height: 768px) {
      height: calc(100vh - 60px);
    } 
`;

export const BackdropImageCarousel = styled.div`
  height: 664.74px;
  width: 1000px;
  position: relative;
  border-radius: 8px; 

    @media (max-height: 768px) {
      height: calc(100vh - 60px);
    } 
`;

export const ImageSlideContainer = styled.div`
  height: 664.74px;
  width: 1000px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

    @media (max-height: 768px) {
      height: calc(100vh - 60px);
    } 
`;

export const CarouselImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

export const DownloadButton = styled.a`
  height: 40px;
  width: 143px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  outline: none;
  font-family: 'Lato';
  font-weight: 700;
  font-size: 16px;
  color: #FFFFFF;
  background-color: #1C70E9;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  z-index: 10;
`;