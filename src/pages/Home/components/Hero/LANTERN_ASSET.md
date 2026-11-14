# Hanging lantern 3D asset

The hanging lantern on the home page uses the real, textured **Brass Diya Lantern** 3D model by **Bhargav Kubal** from [Poly Haven](https://polyhaven.com/a/brass_diya_lantern).

- License: **CC0 1.0 / public domain**, including commercial use.
- Model and license: https://polyhaven.com/a/brass_diya_lantern
- Web GLB mirror: https://www.innerscene.com/tools/library/3d-parts/brass-diya-lantern-5bcf5825
- The verified **7.17 MB glTF v2 binary** is stored at `public/models/brass-diya-lantern.glb` and served by the same origin as the site. No external model CDN is used at runtime.
- Asset origin and reproducibility: `.github/workflows/vendor-lantern.yml` downloads the publicly licensed GLB, verifies the binary file header and size, then commits the asset.

The 3D interaction uses React Three Fiber, Drei, and Rapier, taking the rope joints, model loading and pointer-drag approach from Bubarando's `src/pages/Services/components/Lanyard/Lanyard.jsx`. The scene is lazily loaded after becoming visible and has a licensed preview-image fallback.
