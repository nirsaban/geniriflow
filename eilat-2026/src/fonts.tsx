import '@fontsource/rubik/hebrew-500.css';
import '@fontsource/rubik/hebrew-800.css';
import '@fontsource/rubik/latin-500.css';
import '@fontsource/rubik/latin-800.css';
import '@fontsource/secular-one/hebrew-400.css';
import '@fontsource/secular-one/latin-400.css';
import React, { useEffect, useState } from 'react';
import { continueRender, delayRender } from 'remotion';

export const FONT_UI = 'Rubik, "Noto Sans Hebrew", sans-serif';
export const FONT_TITLE = '"Secular One", Rubik, "Noto Sans Hebrew", sans-serif';

/** Holds rendering until the Hebrew web fonts are loaded, so no frame renders with a fallback font. */
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([
      document.fonts.load('500 40px Rubik', 'שלום abc'),
      document.fonts.load('800 40px Rubik', 'שלום abc'),
      document.fonts.load('400 40px "Secular One"', 'שלום abc'),
    ])
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
  return <>{children}</>;
};
