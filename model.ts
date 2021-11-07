export {};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerJSX &
        React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
interface ModelViewerJSX {
  src: string;
  poster?: string;
}

interface ModelViewerElement extends Element {
  model: {
    materials: Array<{
      name: string;
      pbrMetallicRoughness: {
        setBaseColorFactor: (x: [number, number, number, number]) => void;
        setMetallicFactor: (x: number) => void;
        setRoughnessFactor: (x: number) => void;

        baseColorTexture: null | {
          texture: {
            source: {
              setURI: (x: string) => void;
            };
          };
        };
        metallicRoughnessTexture: null | {
          texture: {
            source: {
              setURI: (x: string) => void;
            };
          };
        };
        // ... others
      };
    }>;
  };
}
