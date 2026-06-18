import {
  useEffect,
  useState,
} from "react";

export const useSidebar = () => {
  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "course-sidebar-collapsed"
      );

    if (saved) {
      setSidebarCollapsed(
        JSON.parse(saved)
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "course-sidebar-collapsed",
      JSON.stringify(
        sidebarCollapsed
      )
    );
  }, [sidebarCollapsed]);

  return {
    sidebarCollapsed,
    setSidebarCollapsed,
  };
};