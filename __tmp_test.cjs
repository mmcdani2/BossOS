const postcss = require('postcss');
const tailwind = require('@tailwindcss/postcss');
const {heroui} = require('@heroui/react');

postcss([
  tailwind({
    config: {
      content: [{ raw: '<div class=\"bg-background\"></div>' }],
      plugins: [heroui()],
    },
  }),
])
  .process('@tailwind utilities;', { from: undefined })
  .then((res) => {
    console.log(res.css.slice(0, 200));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
