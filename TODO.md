# TODO

## Backend order route fix
- [x] Inspect failing require stack and check orderRoutes.js import path
- [ ] Update `backend/routes/orderRoutes.js` to require from the correct folder (`../controllers/orderController`)
- [ ] Restart backend (`npm run dev`) and verify server boots without MODULE_NOT_FOUND

