import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { getUserAddresses, createAddress, updateAddress, deleteAddress } from "../../controllers/address/addressController";



const router = Router()


//#region address Routes
router.get('/', authMiddleware, getUserAddresses)
router.post('/', authMiddleware, createAddress)
router.patch('/:uuid', authMiddleware, updateAddress)
router.delete('/:uuid', authMiddleware, deleteAddress)

//#endregion

export default router