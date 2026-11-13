# Hanging lantern 3D asset

The hanging lantern on the home page uses the real, textured **Brass Diya Lantern** 3D model by **Bhargav Kubal** from [Poly Haven](https://polyhaven.com/a/brass_diya_lantern).

- License: **CC0 1.0 / public domain**, including commercial use.
- Model and license: https://polyhaven.com/a/brass_diya_lantern
- Web GLB mirror: https://www.innerscene.com/tools/library/3d-parts/brass-diya-lantern-5bcf5825
- GLB currently loaded directly from the Innerscene CDN, not stored in the repository. The model therefore needs network access and an available CDN to render.
- For a self-hosted deployment, download the CC0 GLB and save it as `public/models/brass-diya-lantern.glb`, then update `MODEL_URL` in `HangingLanternScene.jsx` to `/models/brass-diya-lantern.glb`.

The 3D interaction uses React Three Fiber, Drei, and Rapier, taking the rope joints, model loading and pointer-drag approach from Bubarando's `src/pages/Services/components/Lanyard/Lanyard.jsx`. The scene is lazily loaded after becoming visible and has a licensed preview-image fallback.
