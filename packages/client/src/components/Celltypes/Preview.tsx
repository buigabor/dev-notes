/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from 'react';
import previewStyles from './styles/previewStyles';

interface PreviewProps {
  code: string;
  error: string;
}

// HTML to inject into iframe
const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <style></style>
  </head>
    <body>
      <div id="root"></div>
      <script>
      const handleError = (err)=>{
        const root = document.querySelector('#root');
          root.innerHTML = '<div style="color:red;"><h4>Runtime Error</h4>' + err + '</div>';
          throw err;
      }
        // To catch async errors
        window.addEventListener('error', (event)=>{
          event.preventDefault();
          handleError(event.error);
        })
      window.addEventListener('message', (event)=>{
        try{
         eval(event.data);
        } catch(err) {
          handleError(err);
        }
      }, false)
      </script>
    </body>
  </html>`;

export const Preview: React.FC<PreviewProps> = ({ code, error }) => {
  const iframe = useRef<any>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Inject the previously declared html

    iframe.current.srcdoc = html;

    // Send the bundled and transpiled code to the child iframe
    setTimeout(() => {
      if (!iframe.current) {
        return;
      }
      iframe.current?.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div css={previewStyles}>
      <iframe
        ref={iframe}
        title="code preview"
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {error && <div className="preview-error">{error}</div>}
    </div>
  );
};
