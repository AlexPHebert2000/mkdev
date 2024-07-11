import React, {useState} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

export default ({id, refreshParent}: {id: number, refreshParent: Function}) => {

  const [anchorEl, setAnchor] = useState<null | HTMLElement>(null)
  const open = !!anchorEl;
  const navigate = useNavigate();

  const openMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(e.currentTarget);
  }
  const closeMenu = () => {
    setAnchor(null);
  }

  const deletePost = async () => {
    await axios.delete(`/api/posts/${id}`);
    refreshParent();
  }

  return (
    <>
      <Tooltip title="More Actions" placement="right" arrow >
        <IconButton onClick={openMenu}>
          <MoreVertIcon/>
        </IconButton>
      </Tooltip>
      <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={closeMenu}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      >
        <MenuItem sx={{textDecoration: 'none'}} onClick={() => {navigate(`/post/${id}/edit`)}}>
          <EditIcon/>
          <Typography variant="body1"> Edit</Typography>
        </MenuItem>
        <MenuItem onClick={deletePost}>
          <DeleteForeverIcon/>
          <Typography variant="body1"> Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}