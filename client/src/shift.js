import React, { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';

export default function ShiftBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Constants and variables (same as before)
    const { PI, cos, sin, abs, sqrt, pow, random, atan2 } = Math;
    const TAU = 2 * PI;
    const rand = n => random() * n;
    const fadeInOut = (t, m) => {
      let hm = 0.5 * m;
      return abs((t + hm) % m - hm) / hm;
    };
    const circleCount = 150;
    const circlePropCount = 8;
    const circlePropsLength = circleCount * circlePropCount;
    const baseSpeed = 0.1;
    const rangeSpeed = 1;
    const baseTTL = 150;
    const rangeTTL = 200;
    const baseRadius = 100;
    const rangeRadius = 200;
    const rangeHue = 60;
    const xOff = 0.0015;
    const yOff = 0.0015;
    const zOff = 0.0015;
    const backgroundColor = 'hsla(0,0%,5%,1)';

    let circleProps = new Float32Array(circlePropsLength);
    let simplex = createNoise3D();
    let baseHue = 220;

    function initCircle(i) {
      let x = rand(canvas.width);
      let y = rand(canvas.height);
      let n = simplex(x * xOff, y * yOff, baseHue * zOff);
      let t = rand(TAU);
      let speed = baseSpeed + rand(rangeSpeed);
      let vx = speed * cos(t);
      let vy = speed * sin(t);
      let life = 0;
      let ttl = baseTTL + rand(rangeTTL);
      let radius = baseRadius + rand(rangeRadius);
      let hue = baseHue + n * rangeHue;

      circleProps.set([x, y, vx, vy, life, ttl, radius, hue], i);
    }

    for (let i = 0; i < circlePropsLength; i += circlePropCount) {
      initCircle(i);
    }

    function checkBounds(x, y, radius) {
      return (
        x < -radius ||
        x > canvas.width + radius ||
        y < -radius ||
        y > canvas.height + radius
      );
    }

    function drawCircle(x, y, life, ttl, radius, hue) {
      ctx.save();
      ctx.fillStyle = `hsla(${hue},60%,30%,${fadeInOut(life, ttl)})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TAU);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }

    function updateCircle(i) {
      let i2 = i + 1,
        i3 = i + 2,
        i4 = i + 3,
        i5 = i + 4,
        i6 = i + 5,
        i7 = i + 6,
        i8 = i + 7;

      let x = circleProps[i];
      let y = circleProps[i2];
      let vx = circleProps[i3];
      let vy = circleProps[i4];
      let life = circleProps[i5];
      let ttl = circleProps[i6];
      let radius = circleProps[i7];
      let hue = circleProps[i8];

      drawCircle(x, y, life, ttl, radius, hue);

      life++;

      circleProps[i] = x + vx;
      circleProps[i2] = y + vy;
      circleProps[i5] = life;

      if (checkBounds(x, y, radius) || life > ttl) {
        initCircle(i);
      }
    }

    function updateCircles() {
      baseHue++;

      for (let i = 0; i < circlePropsLength; i += circlePropCount) {
        updateCircle(i);
      }
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      updateCircles();
      ctx.filter = 'blur(50px)';
      ctx.drawImage(canvas, 0, 0);
      ctx.filter = 'none';
    }

    let animationFrameId;
    function draw() {
      render();
      animationFrameId = requestAnimationFrame(draw);
    }

    // Resize canvas to full window size
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
}

// Credits: https://tympanus.net/Development/AmbientCanvasBackgrounds/index3.html 