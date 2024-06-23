import React, { useEffect, useState, useRef, useContext } from "react";
import axios from 'axios';
import {UserContext} from './UserContext'
import { useParams, Link } from 'react-router-dom';
import { PostWithRelations } from "../../../types";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import MarkDown from "./MarkDown";
import RepoDisplay from "./RepoDisplay";

import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Chip from '@mui/material/Chip'


const FullPost = ():React.ReactElement => {

  const { id } = useParams();
  const [content, setContent]: [PostWithRelations | null, Function] = useState(null);
  const contentREF = useRef(content);
  const userId = useContext(UserContext);

  const handleLike = () => {
    axios.patch(`/api/posts/${content!.id}/${content!.likedByUser ? 'dislike' : 'like'}`)
      .then(() => {getPost()})
  }

  const getPost = () => {
    axios.get(`/api/posts/${id}`)
      .then(({data}) => {
        setContent(data);
      })
  }

  useEffect(getPost, [contentREF])

  try {
    return (
      <>
        <Box sx={{display:"flex", flexDirection:'row', marginLeft: 1, marginTop: 1, alignItems: 'center'}}>
          <Link to={`/user/${content!.author.id}/profile`}>
            <Avatar alt={content!.author.username!} src={content!.author.picture!}>
              {'?'}
            </Avatar>
          </Link>
          <Typography variant="h1" sx={{fontSize: 20, marginLeft: 2, marginRight: 2}}>{content!.author.username || content!.author.name}</Typography>
          <Typography variant="body2" sx={{color: 'lightgrey'}}>{dayjs(content!.createdAt).fromNow()}</Typography>
          <IconButton aria-label='Like' onClick={handleLike} disabled={!userId}>
            {content!.likedByUser ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          <Typography variant="body1">{content!.liked.length}</Typography>
        </Box>
          <Box sx={{display:"flex", flexDirection:'column', marginLeft: 2}}>
          <MarkDown text={content!.title} />
          <Box sx={{display:"flex", flexDirection:'row', marginLeft: 1, marginTop: -1, alignItems: 'center'}}>
            {
              content!.tags.length ?
              content!.tags.map((tag) => (
                <Chip
                  label={tag.name}
                  variant="outlined"
                  size="small"
                  key={tag.name + content!.id}
                />
              ))
              :
              <></>
            }
          </Box>
          <MarkDown text={content!.body} />
        </Box>
        <Box>
          {content!.repo ? <RepoDisplay content={content!.repo}/> : <></>}
        </Box>
      </>
    )
  }
  catch (err) {
    console.error(err);
    return <></>
  }
}

export default FullPost;