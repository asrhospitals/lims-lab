import React from "react";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";

/**
 * @param {Array} items - Array of breadcrumb items.
 * Each item should be an object: { label: string, href?: string }
 */
export const Breadcrumb = ({ items = [] }) => {
  return (
    <CBreadcrumb >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <CBreadcrumbItem
            key={index}
            href={!isLast ? item.href : undefined}
            active={isLast} 
          >
            {item.label}
          </CBreadcrumbItem>
        );
      })}
    </CBreadcrumb>
  );
};
