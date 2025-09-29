// CSS 模块类型声明
declare module "*.module.css" {
  const content: { [className: string]: string };
  export default content;
}

// SCSS 模块类型声明
declare module "*.module.scss" {
  const content: { [className: string]: string };
  export default content;
}

// SASS 模块类型声明
declare module "*.module.sass" {
  const content: { [className: string]: string };
  export default content;
}

// 全局 CSS 副作用导入（用于 globals.css 等）
declare module "*.css" {
  const content: Record<string, never>;
  export default content;
}

// 全局 SCSS 副作用导入
declare module "*.scss" {
  const content: Record<string, never>;
  export default content;
}

// PostCSS 文件
declare module "*.pcss" {
  const content: { [className: string]: string };
  export default content;
}