import React, { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserProfile } from '../../../types';
import axios from 'axios';

const Followers = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const [followerData, setFollowerData] = useState<UserProfile[] | null>(null);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    axios.get(`/api/follows/followers/${id}`).then(({ data }): void => {
      console.log('followers', data);
      setFollowerData(data);
    });
    axios
      .get(`/api/follows/count/${id}`)
      .then(({ data }) => {
        setFollowerCount(data.follower_count);
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div>
      <h3>Followers</h3>
      <p>
        {followerData
          ? `Number of followers: ${followerData.length}`
          : 'Loading...'}
      </p>
      <div>
        {followerData &&
          followerData.map((follower) => (
            <div key={follower.id}>{follower.name}</div>
          ))}
      </div>
    </div>
  );
};

export default Followers;
