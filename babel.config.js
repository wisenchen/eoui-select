/*
 * @Name: file content
 * @Copyright: 广州银云信息科技有限公司
 * @Author: 
 * @Date: 2022-02-22 17:55:05
 * @LastEditors: wisen
 * @LastEditTime: 2022-02-22 17:55:05
 */
module.exports = function (api) {
    process.env.NODE_ENV === "development" ? api.cache(false) : api.cache(true);
    const presets = [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "current",
          },
        },
      ],
      "@babel/preset-typescript",
    ];
    const plugins = [];
    return {
      presets,
      plugins,
    };
  };