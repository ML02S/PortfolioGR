import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import "../src/app/styles/md.css";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    img: (props) => {
      // Determine alt text, prioritizing the prop's alt, then fallback methods
      const altText = props.alt || 
        (typeof props.src === 'string' 
          ? props.src.split('/').pop() || 'Image' 
          : 'Image');

      // Omit alt from the spread to prevent duplicate alt warning
      const { alt, ...restProps } = props as ImageProps;

      return (
        <Image
          className="img"
          sizes="100vw"
          width={1000}
          height={1000}
          style={{ width: "100%", height: "auto" }}
          priority={true}
          alt={altText}
          {...restProps}
        />
      );
    },
    // Video component remains the same
    video: (props) => (
      <video 
        className="video"
        controls
        style={{ width: "100%", height: "auto" }}
        {...props}
      />
    ),
    ...components,
  };
}