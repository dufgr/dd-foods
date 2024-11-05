import Image, { ImageProps } from "next/image";

type PromoBannerProps = Omit<ImageProps, "alt"> & { alt: string };

// Exige texto alternativo e preserva dimensoes fluidas para os banners.
const PromoBanner = ({ alt, ...props }: PromoBannerProps) => {
  return (
    <Image
      alt={alt}
      height={450}
      width={1050}
      className="h-auto w-full object-contain"
      sizes="100%"
      {...props}
    />
  );
};

export default PromoBanner;
