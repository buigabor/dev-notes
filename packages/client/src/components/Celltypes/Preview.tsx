/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef } from 'react';
import previewStyles from './styles/previewStyles';

interface PreviewProps {
  code: string;
  error: string;
}

// HTML to inject into iframe
const html = `<html>
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

  useEffect(() => {
    // Inject the previously declared html
    iframe.current.srcdoc = html;
    // Send the bundled and transpiled code to the child iframe
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);
  return (
    <div css={previewStyles}>
      <iframe
        title="code preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {error && <div className="preview-error">{error}</div>}
    </div>
  );
};
