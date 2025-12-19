import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // agar xohlasang olib tashlasa bo‘ladi
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
