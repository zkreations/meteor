export const initIconActions = (root: HTMLElement) => {
  const getConfig = () => {
    const sizeInput = root.querySelector<HTMLInputElement>('[data-setting-size]');
    const size = sizeInput?.dataset.sizeActual || '24';
    const stroke = root.querySelector<HTMLInputElement>('[data-setting-stroke]')?.value || '2';
    const colorInput = root.querySelector<HTMLInputElement>('[data-setting-color]');

    return {
      size,
      stroke,
      color: colorInput?.dataset.colorActual || 'currentColor'
    };
  };

  const getSvgString = (svg: SVGElement) => {
    const config = getConfig();
    const clone = svg.cloneNode(true) as SVGElement;

    clone.removeAttribute('style');

    clone.setAttribute('width', config.size);
    clone.setAttribute('height', config.size);
    clone.setAttribute('stroke-width', config.stroke);

    let str = clone.outerHTML;

    if (config.color !== 'currentColor') {
      str = str.replace(/currentColor/g, config.color);
    }

    return str;
  };

  root.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    const btnCopy = target.closest('.action-copy-svg');
    const btnPng = target.closest('.action-download-png');
    const btnSvg = target.closest('.action-download-svg');

    if (!btnCopy && !btnPng && !btnSvg) return;

    const article = target.closest('article[data-name]');
    const name = article?.getAttribute('data-name') || 'icon';
    const svg = article?.querySelector('.icon-preview svg') as SVGElement;

    if (!svg) return;

    const svgStr = getSvgString(svg);

    if (btnCopy) {
      navigator.clipboard.writeText(svgStr);
    }

    if (btnSvg) {
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.svg`;
      a.click();

      URL.revokeObjectURL(url);
    }

    if (btnPng) {
      const size = parseInt(getConfig().size, 10) || 24;

      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      const img = new Image();

      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size);
        URL.revokeObjectURL(url);

        canvas.toBlob((pngBlob) => {
          if (!pngBlob) return;

          const pngUrl = URL.createObjectURL(pngBlob);

          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `${name}.png`;
          a.click();

          URL.revokeObjectURL(pngUrl);
        });
      };

      img.src = url;
    }
  });
};
