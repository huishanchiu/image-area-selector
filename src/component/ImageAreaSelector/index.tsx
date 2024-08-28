import styled from "@emotion/styled";
import { useEffect, useState, useContext } from "react";
import { SelectionContext } from "@context/ImageAreaSelectorContext";
import ImageAreaSelectorProvider from "@context/ImageAreaSelectorProvider";
import { Theme } from "@emotion/react";
import DataPreview from "@component/ImageAreaSelector/DataPreview";
import ImagePreview from "@component/ImageAreaSelector/ImagePreview";
import ImageUploader from "@component/ImageAreaSelector/ImageUploader";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;
const InnerContainer = styled.div`
  width: 433px;
  min-height: 792px;
  background-color: ${(props: { theme: Theme }) => props.theme.colorNeutral150};
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
  margin-bottom: 30px;
`;
const Header = styled.div`
  height: 56px;
  background-color: ${(props: { theme: Theme }) => props.theme.colorNeutral200};
  display: flex;
  align-items: center;
  padding-left: 20px;
`;
const CircleIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props: { theme: Theme }) => props.theme.colorNeutral500};
`;
const ImageContainer = styled.div`
  width: 355px;
  display: flex;
  justify-content: center;
  margin: 35px auto;
`;
const Image = styled.img`
  width: 355px;
  border: 2px solid ${(props: { theme: Theme }) => props.theme.colorPrimary100};
  border-radius: 10px;
`;

const ImageArea = () => {
  const { setImgIntrinsicSize, setImgBoundary, imgBoundary } =
    useContext(SelectionContext);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height, naturalWidth, naturalHeight } = e.currentTarget;
    setImgBoundary({ width, height });
    setImgIntrinsicSize({ width: naturalWidth, height: naturalHeight });
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Container>
      <InnerContainer>
        <Header>
          <CircleIcon />
        </Header>
        <ImageContainer>
          {previewUrl ? (
            <ImagePreview imgBoundary={imgBoundary}>
              <Image
                src={previewUrl}
                alt="uploaded-image"
                onLoad={handleImageLoad}
              />
            </ImagePreview>
          ) : (
            <ImageUploader setPreviewUrl={setPreviewUrl} />
          )}
        </ImageContainer>
      </InnerContainer>
      <DataPreview />
    </Container>
  );
};

export const ImageAreaSelector = () => {
  return (
    <ImageAreaSelectorProvider>
      <ImageArea />
    </ImageAreaSelectorProvider>
  );
};
