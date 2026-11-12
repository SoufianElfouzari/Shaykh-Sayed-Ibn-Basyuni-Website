import React from "react";

function MosqueSkyline() {
  return (
    <g fill="#C6B386" opacity=".46">
      <path d="M0 745h368v80H0z" />
      <path d="M55 746v-51h8v-38h7v-10h7v10h7v38h8v51zM150 746v-35h12v-67h8v-21h6v-16h4v16h6v21h8v67h12v35z" />
      <path d="M98 747v-58c0-40 27-68 61-90 36 22 61 50 61 90v58z" />
      <path d="M158 595v-23m-6 4q-11-7-4-18m-3 8q8 10 17-1" fill="none" stroke="#C6B386" strokeWidth="3" strokeLinecap="round" />
      <path d="M225 745v-65h8v-25h5v-16h4v16h5v25h8v65zM280 745v-40h6v-20h4v-10h4v10h4v20h7v40zM315 745v-18q22-43 44 0v18z" />
    </g>
  );
}

function HangingLantern() {
  return (
    <g className="sib-art-lantern">
      <path d="M1400 0v91" stroke="#97711D" strokeWidth="2" strokeDasharray="3 3" />
      <path d="M1400 79v21m-16 13h32m-16-13-16 13 16 8 16-8-16-13z" fill="#D5B050" stroke="#85641B" strokeWidth="2" />
      <path d="M1380 122 1369 137v78l16 18h30l16-18v-78l-11-15z" fill="url(#sib-lantern-gold)" stroke="#785516" strokeWidth="3" strokeLinejoin="round" />
      <path d="M1385 138h30v75h-30z" fill="#FFF9DB" />
      <path d="M1400 147c-10 14-13 30 0 50 13-20 10-36 0-50z" fill="#F9C64B" opacity=".85" />
      <path d="M1384 138v78m32-78v78m-47-1h62M1369 137h62m-46 96 15 13 15-13" fill="none" stroke="#785516" strokeWidth="3" />
      <path d="M1375 163h50m-50 28h50" stroke="#BD8F27" strokeWidth="2" />
      <path d="M1400 245v17" stroke="#785516" strokeWidth="3" strokeLinecap="round" />
      <circle cx="1400" cy="263" r="4" fill="#B38220" />
      <ellipse cx="1400" cy="175" rx="48" ry="65" fill="url(#sib-lantern-glow)" opacity=".37" />
    </g>
  );
}

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
        <linearGradient id="sib-lantern-gold" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#7F5D19" />
          <stop offset=".45" stopColor="#E9C261" />
          <stop offset="1" stopColor="#846419" />
        </linearGradient>
        <radialGradient id="sib-lantern-glow">
          <stop stopColor="#FFC849" stopOpacity=".78" />
          <stop offset="1" stopColor="#FFC849" stopOpacity="0" />
        </radialGradient>
        <pattern id="sib-art-geom" width="46" height="46" patternUnits="userSpaceOnUse">
          <path d="M23 1 34 12 45 23 34 34 23 45 12 34 1 23 12 12ZM23 8l15 15-15 15L8 23zM23 0v46M0 23h46" fill="none" stroke="#F2CE7B" strokeOpacity=".24" strokeWidth="1.05" />
        </pattern>
      </defs>
      <circle cx="800" cy="396" r="580" stroke="#C69E54" strokeOpacity=".21" fill="none" />
      <circle cx="800" cy="396" r="435" stroke="#C69E54" strokeOpacity=".12" fill="none" />
      <path d="M0 0h280c-80 56-100 91-100 151h-53v60C80 227 32 256 0 294z" fill="url(#sib-art-green)" opacity=".14" />
      <path d="M0 0h280c-80 56-100 91-100 151h-53v60C80 227 32 256 0 294" stroke="url(#sib-art-gold)" strokeWidth="6" fill="none" />
      <path d="M0 0h212v240H0z" fill="url(#sib-art-geom)" opacity=".43" />
      <HangingLantern />
      <MosqueSkyline />
      <path d="M0 663q90-63 167-17t143 90q-77 10-154 45H0z" fill="url(#sib-art-cloud)" opacity=".72" />
      <path d="M1300 674q94-69 166-19t134 75v110h-300z" fill="url(#sib-art-cloud)" opacity=".68" />
      <path d="M0 740C130 748 230 831 390 842c185 17 286 3 410-19 183 36 339 32 479-34 113-53 220-55 321-26v87H0z" fill="#F6F3ED" opacity=".9" />
      <path d="M0 738C130 763 233 832 389 850H0z" fill="url(#sib-art-green)" />
      <path d="M0 738C130 763 233 832 389 850" stroke="url(#sib-art-gold)" strokeWidth="6" fill="none" />
      <path d="M0 749C120 777 234 843 363 850H0z" fill="url(#sib-art-geom)" opacity=".9" />
      <path d="M1600 658C1558 718 1540 730 1492 745c-40-20-90-19-132 7-90 53-135 84-202 98h442z" fill="url(#sib-art-green)" />
      <path d="M1600 658C1558 718 1540 730 1492 745c-40-20-90-19-132 7-90 53-135 84-202 98" stroke="url(#sib-art-gold)" strokeWidth="6" fill="none" />
      <path d="M1600 679c-30 42-61 60-111 83-40-19-82-15-114 5l-77 83h302z" fill="url(#sib-art-geom)" opacity=".86" />
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
