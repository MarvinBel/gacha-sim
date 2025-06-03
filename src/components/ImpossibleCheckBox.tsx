import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const ImpossibleCheckbox: React.FC = () => {
  const [checked, setChecked] = useState(false);
  const [count, setCount] = useState(1);
  const bearRef = useRef<SVGSVGElement | null>(null);
  const swearRef = useRef<HTMLDivElement | null>(null);
  const armWrapRef = useRef<HTMLDivElement | null>(null);
  const pawRef = useRef<HTMLDivElement | null>(null);
  const armRef = useRef<SVGSVGElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  const armLimit = Math.random() * 3;
  const headLimit = armLimit + Math.random() * 3;
  const angerLimit = headLimit + Math.random() * 3;
  const armDuration = 0.2;
  const bearDuration = 0.25;
  const checkboxDuration = 0.25;
  const pawDuration = 0.1;

  const SOUNDS = {
    ON: new Audio('https://assets.codepen.io/605876/switch-on.mp3'),
    OFF: new Audio('https://assets.codepen.io/605876/switch-off.mp3'),
    GROAN: new Audio('https://assets.codepen.io/605876/bear-groan.mp3'),
  };
  SOUNDS.GROAN.playbackRate = 2;

  const onHover = () => {
    if (Math.random() > 0.5 && count > armLimit) {
      gsap.to(bearRef.current, bearDuration / 2, { y: '40%' });
    }
  };

  const offHover = () => {
    if (!checked) {
      gsap.to(bearRef.current, bearDuration / 2, { y: '100%' });
    }
  };

  const onChange = () => {
    if (checked) return;
    setChecked(true);
  };

  useEffect(() => {
    const grabBearTL = () => {
      let bearTranslation: string | undefined;
      if (count > armLimit && count < headLimit) {
        bearTranslation = '40%';
      } else if (count >= headLimit) {
        bearTranslation = '0%';
      }
      const onComplete = () => {
        setChecked(false);
        setCount(count + 1);
      };
      let onBearComplete = () => {};
      if (Math.random() > 0.5 && count > angerLimit) {
        onBearComplete = () => {
          SOUNDS.GROAN.play();
          gsap.set(swearRef.current, { display: 'block' });
        };
      }
      const base = armDuration + armDuration + pawDuration;
      const preDelay = Math.random();
      const delay = count > armLimit ? base + bearDuration + preDelay : base;
      const bearTL = gsap.timeline({ delay: Math.random(), onComplete });
      bearTL
        .add(
          count > armLimit
            ? gsap.to(bearRef.current, {
                duration: bearDuration,
                onComplete: onBearComplete,
                y: bearTranslation,
              })
            : () => {}
        )
        .to(armWrapRef.current, { x: 50, duration: armDuration }, count > armLimit ? preDelay : 0)
        .to(armRef.current, { scaleX: 0.7, duration: armDuration })
        .to(pawRef.current, {
          duration: pawDuration,
          scaleX: 0.8,
          onComplete: () => gsap.set(swearRef.current, { display: 'none' }),
        })
        .to(
          bgRef.current,
          {
            onStart: () => {
              SOUNDS.OFF.play();
            },
            duration: checkboxDuration,
            backgroundColor: '#aaa',
          },
          delay
        )
        .to(indicatorRef.current, { duration: checkboxDuration, x: '0%' }, delay)
        .to(pawRef.current, { duration: pawDuration, scaleX: 0 }, delay)
        .to(armRef.current, { duration: pawDuration, scaleX: 1 }, delay + pawDuration)
        .to(armWrapRef.current, { duration: armDuration, x: 0 }, delay + pawDuration)
        .to(bearRef.current, { duration: bearDuration, y: '100%' }, delay + pawDuration);
      return bearTL;
    };

    const showTimeline = () => {
      gsap.timeline({
        onStart: () => SOUNDS.ON.play(),
      })
        .to(bgRef.current, { duration: checkboxDuration, backgroundColor: '#2eec71' }, 0)
        .to(indicatorRef.current, { duration: checkboxDuration, x: '100%' }, 0)
        .add(grabBearTL(), checkboxDuration);
    };

    if (checked) showTimeline();
  }, [checked, count]);

  return (
    <div className="relative flex items-center justify-center h-screen bg-purple-500">
      <div ref={swearRef} className="absolute left-full top-0 text-white font-bold text-lg p-2 rounded-xl hidden">
        #@$%*!
      </div>
      <svg
        ref={bearRef}
        className="bear w-full absolute top-full"
        viewBox="0 0 284.94574 359.73706"
        preserveAspectRatio="xMinYMin"
      >
        {/* ... Ajoute ici le code SVG de l'ours */}
      </svg>
      <div ref={armWrapRef} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-0">
        <svg ref={armRef} className="bear__arm" viewBox="0 0 250 100" preserveAspectRatio="xMinYMin">
          {/* ... Ajoute ici le code SVG de l'arm */}
        </svg>
      </div>
      <div ref={pawRef} className="absolute bg-brown w-8 h-8 rounded-full z-10" />
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-purple-500 opacity-75"></div>

      <div
        className="relative cursor-pointer flex justify-center items-center bg-gray-300 rounded-full w-48 h-24"
        onMouseOver={onHover}
        onMouseOut={offHover}
      >
        <input type="checkbox" onChange={onChange} checked={checked} className="absolute inset-0 opacity-0" />
        <div ref={bgRef} className="absolute inset-0 bg-gray-500 rounded-full"></div>
        <div ref={indicatorRef} className="absolute inset-y-0 left-0 bg-transparent w-1/2 rounded-full"></div>
      </div>
    </div>
  );
};

export default ImpossibleCheckbox;
