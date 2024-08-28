import styled from "@emotion/styled";
import { useTheme, Theme } from "@emotion/react";
import ImageIcon from "@assets/SVG/imageIcon";

const FileLabel = styled.label`
  width: 100%;
  height: 156px;
  background-color: ${(props: { theme: Theme }) => props.theme.colorNeutral100};
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border: 2px solid ${(props: { theme: Theme }) => props.theme.colorNeutral500};
  border-radius: 10px;
`;
const HiddenInput = styled.input`
  display: none;
`;

const Text = styled.p`
  color: ${(props: { theme: Theme }) => props.theme.colorNeutral400};
`;

type Props = {
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
};

const ImageUploader = (props: Props) => {
  const { setPreviewUrl } = props;
  const theme = useTheme();

  const onSelectImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imgUrl = URL.createObjectURL(file);
    setPreviewUrl(imgUrl);
  };

  return (
    <FileLabel htmlFor="file-upload">
      <ImageIcon color={theme.colorNeutral400} width={16} height={16} />
      <Text>Upload Image</Text>
      <HiddenInput
        onChange={onSelectImg}
        id="file-upload"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
      />
    </FileLabel>
  );
};

export default ImageUploader;
