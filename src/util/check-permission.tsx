import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useEffect, useState } from 'react';
interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface Permission {
  read?: boolean;
  create?: boolean;
  update?: boolean;
  delete?: boolean;
}

const CheckPermission = (permission: string) => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  if (authUser?.user?.roles && authUser.user.roles.length > 0) {
    return authUser.user.roles.some((role) => role.permissions.includes(permission));
  }
};

export default CheckPermission;
