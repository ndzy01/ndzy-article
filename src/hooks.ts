import { configResponsive, useResponsive as useResponsiveA } from 'ahooks';

configResponsive({
  small: 0,
  middle: 800,
  large: 1200,
});

export const useResponsive = () => {
  const responsive = useResponsiveA();

  return responsive;
};
