import { Request, response, Response } from "express";
import { getAllUsersService, getUserByUuidService, updateUserService, deleteUserService } from "../../services/user/userService";

interface AuthenticatedRequest extends Request {
  user?: { uuid: string }
}


//#region User controller in User Dashboard (Customer Self-Management Controllers)

// GET /api/users/me
export const getMyProfile = async (request: AuthenticatedRequest, response: Response): Promise<void> => {
  try {
    const uuid = request.user?.uuid!;
    const user = await getUserByUuidService(uuid);
    response.status(200).json({ data: user });
  } catch (error: any) {
    response.status(404).json({ error: error.message });
  }
};

// PATCH /api/users/me
export const updateMyProfile = async (request: AuthenticatedRequest, response: Response): Promise<void> => {
  try {
    const uuid = request.user?.uuid!;
    
    if (request.body.role) {
      response.status(403).json({ error: 'Action forbidden: Cannot alter account role hierarchy' });
      return;
    }

    await updateUserService(uuid, request.body);
    response.status(200).json({ message: 'Your profile has been updated successfully' });
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
};

// DELETE /api/users/me
export const deleteMyAccount = async (request: AuthenticatedRequest, response: Response): Promise<void> => {
  try {
    const uuid = request.user?.uuid!;
    await deleteUserService(uuid);

    response.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    response.status(200).json({ message: 'Your e-commerce account has been permanently terminated' });
  } catch (error: any) {
    response.status(500).json({ error: error.message });
  }
};

//#endregion



//#region User Controller in Admin Dashboard

// GET /api/users
export const getAllUsers = async () : Promise<void> => {
  try {
    const users = await getAllUsersService()
    response.status(200).json({data: users})
  } catch (error: any) {
    response.status(500).json({error: error.message})
  }
}


// GET /api/users/:uuid
export const getUserByUuid = async (request: Request, response: Response): Promise<void> => {
  try {
    const uuid  = String(request.params.uuid)
    const user = await getUserByUuidService(uuid)
    response.status(200).json({ data: user })
  } catch (error: any) {
    response.status(404).json({ error: error.message })
  }
}


// PATCH /api/users/:uuid
export const updateUser = async (request: AuthenticatedRequest, response: Response): Promise<void> => {
  try {
    const { uuid } = request.params
    if (request.user?.uuid !== uuid) {
      response.status(403).json({ error: 'Unauthorized' })
      return
    }
    await updateUserService(uuid, request.body)
    response.status(200).json({ message: 'User updated successfully' })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}


// DELETE /api/users/:uuid
export const deleteUser = async (request: AuthenticatedRequest, response: Response): Promise<void> => {
  try {
    const { uuid } = request.params
    if (request.user?.uuid !== uuid) {
      response.status(403).json({ error: 'Unauthorized' })
      return
    }
    await deleteUserService(uuid)
    response.status(200).json({ message: 'User deleted successfully' })
  } catch (error: any) {
    response.status(500).json({ error: error.message })
  }
}


//#endregion