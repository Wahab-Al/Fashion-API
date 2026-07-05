import { Request, Response } from "express";
import { getCartWithItemsService, addItemToCartService, updateCartItemService,
  removeItemFromCartService, clearCartService } from "../../services/cart/cartService";

// Standard regex to validate standard UUIDv4 format
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Fetches the active cart and all its items for the authenticated user.
 * @param request - Express request object containing user authentication data.
 * @param response - Express response object to send back the cart details.
 */
export const getCart = async (request: Request, response: Response) : Promise<void> =>{
  try {
    const userUuid = request.user?.uuid
    if(!userUuid || !UUID_REGEX.test(userUuid)){
      response.status(400).json({ error: `Invalid or missing user identity`})
      return
    }
    const result = await getCartWithItemsService(userUuid)
    response.status(200).json({ data: result })
  } catch (error: any) {
    response.status(500).json({ error: 'Internal server error' });
  }
}



/**
 * Adds a new product to the cart or increases its quantity.
 * @param request - Express request containing product payload and quantity.
 * @param response - Express response object indicating operation outcome.
 */
export const addItemToCart = async (request: Request, response: Response) : Promise<void> => {
  try {
    const userUuid = request.user?.uuid
    const { product_uuid, quantity } = request.body

    if (!userUuid || !UUID_REGEX.test(userUuid)) {
      response.status(400).json({ error: 'Invalid or missing user identity.' });
      return;
    }
    if (!product_uuid || !UUID_REGEX.test(product_uuid)) {
      response.status(400).json({ error: 'Invalid or missing product UUID.' });
      return;
    }

    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || !Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      response.status(400).json({ error: 'Quantity must be a positive whole integer.' });
      return;
    }

    await addItemToCartService(userUuid, product_uuid, parsedQuantity);
    response.status(201).json({ message: 'Item added to cart successfully' });
  } catch (error: any) {
    if (error.message === 'Insufficient stock') {
      response.status(409).json({ error: error.message });
      return;
    }
    response.status(500).json({ error: 'Internal server error' });
  }
}



/**
 * Updates the quantity of an existing item inside the cart.
 * @param request - Express request containing item UUID parameter and new quantity.
 * @param response - Express response object confirming the change.
 */
export const updateCartItem = async (request: Request, response: Response): Promise<void> => {
  try {
    const uuid = String(request.params.uuid)
    const quantity = request.body.quantity

    if (!uuid || !UUID_REGEX.test(uuid)) {
      response.status(400).json({ error: 'Invalid or missing cart item UUID.' });
      return;
    }

    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity) || !Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
      response.status(400).json({ error: 'Quantity must be a valid non-negative integer.' });
      return;
    }

    await updateCartItemService(uuid, parsedQuantity);
    response.status(200).json({ message: 'Cart item updated successfully' });
  } catch (error: any) {
    response.status(500).json({ error: 'Internal server error' });
  }
}



/**
 * Removes a single specific product record out of the user's cart.
 * @param request - Express request targeting the item UUID to delete.
 * @param response - Express response confirming the deletion.
 */
export const removeItemFromCart = async (request: Request, response: Response): Promise<void> => {
  try {
    const uuid = String(request.params.uuid)

    if (!uuid || !UUID_REGEX.test(uuid)) {
      response.status(400).json({ error: 'Invalid or missing cart item UUID.' });
      return;
    }

    await removeItemFromCartService(uuid);
    response.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (error: any) {
    response.status(500).json({ error: 'Internal server error' });
  }
};



/**
 * Deletes all items inside the active cart, resetting it to empty.
 * @param request - Express request recognizing the authenticated owner.
 * @param response - Express response confirming the empty status.
 */
export const clearCart = async (request: Request, response: Response): Promise<void> => {
  try {
    const userUuid = request.user?.uuid;

    if (!userUuid || !UUID_REGEX.test(userUuid)) {
      response.status(400).json({ error: 'Invalid or missing user identity.' });
      return;
    }

    await clearCartService(userUuid);
    response.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error: any) {
    response.status(500).json({ error: 'Internal server error' });
  }
}