export function HeroBackdrop() {
  return (
    <svg className="sib-home-hero-artwork" viewBox="0 0 1600 850" preserveAspectRatio="xMidYMid slice" role="presentation" focusable="false" aria-hidden="true">
      <defs>
        <linearGradient id="sib-art-green" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#176F51" />
          <stop offset=".5" stopColor="#08674D" />
          <stop offset="1" stopColor="#034A39" />
        </linearGradient>
        <linearGradient id="sib-art-gold" x1="0" x2="1">
          <stop stopColor="#B77A11" />
          <stop offset=".55" stopColor="#F8D47E" />
          <stop offset="1" stopColor="#C38A1E" />
        </linearGradient>
        <linearGradient id="sib-art-cloud" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#D9CEB9" stopOpacity=".22" />
          <stop offset="1" stopColor="#C9B68C" stopOpacity=".03" />
        </linearGradient>
        <pattern id="sib-art-geom" width="46" height="46" patternUnits="userSpaceOnUse">
          <path d="M23 1 34 12 45 23 34 34 23 45 12 34 1 23 12 12ZM23 8l15 15-15 15L8 23zM23 0v46M0 23h46" fill="none" stroke="#F2CE7B" strokeOpacity=".24" strokeWidth="1.05" />
        </pattern>
      </defs>
      <circle cx="800" cy="396" r="580" stroke="#C69E54" strokeOpacity=".21" fill="none" />
      <circle cx="800" cy="396" r="435" stroke="#C69E54" strokeOpacity=".12" fill="none" />
      <path d="M0 663q90-63 167-17t143 90q-77 10-154 45H0z" fill="url(#sib-art-cloud)" opacity=".72" />
      <path d="M1300 674q94-69 166-19t134 75v110h-300z" fill="url(#sib-art-cloud)" opacity=".68" />
      <path d="M0 740C130 748 230 831 390 842c185 17 286 3 410-19 183 36 339 32 479-34 113-53 220-55 321-26v87H0z" fill="#F6F3ED" opacity=".9" />
    </svg>
  );
}

function FeatureIcon({ kind }) {
  const common={fill:"none",stroke:"currentColor",strokeWidth:2.3,strokeLinecap:"round",strokeLinejoin:"round"};
  if(kind==="knowledge")return <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path {...common} d="M20 5 2.8 13.5 20 22l17.2-8.5L20 5ZM9 17v8.5c6.6 5.8 15.4 5.8 22 0V17M36 14v12" /></svg>;
  if(kind==="lessons")return <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path {...common} d="M20 5 4 13l16 8 16-8-16-8ZM5 20l15 8 15-8M5 27l15 8 15-8" /></svg>;
  return <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path {...common} d="M20 4 34 9v11c0 8-5.9 12.6-14 16-8.1-3.4-14-8-14-16V9L20 4ZM13 20l5 5 9-10" /></svg>;
}

export function HeroFeature({kind,title,subtitle}) {
  return (
    <div className="sib-home-hero-feature">
      <span className="sib-home-hero-feature-icon"><FeatureIcon kind={kind}/></span>
      <span className="sib-home-hero-feature-copy"><strong>{title}</strong><small>{subtitle}</small></span>
    </div>
  );
}
