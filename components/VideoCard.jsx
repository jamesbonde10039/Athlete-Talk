import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

export default function VideoCard({ details }) {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '10px',
        boxShadow: 3,
        '&:hover': {
          boxShadow: 5,
        },
      }}
    >
      <iframe
        src={`https://drive.google.com/file/d/${details.gDriveID}/preview`}
        style={{ minHeight: 230, width: '100%', borderRadius: '10px' }}
        allow="autoplay"
        allowFullScreen
      ></iframe>
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {details.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {details.description}
        </Typography>
      </CardContent>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography sx={{ mb: 1 }} variant="body2" color="primary">
          Categories
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
          }}
        >
          {details.categories.map((category, idx) => {
            if (idx < 3)
              return (
                <Typography
                  key={idx}
                  sx={{
                    mr: 1,
                    borderRadius: 5,
                    bgcolor: 'primary.light',
                    width: 'fit-content',
                    pl: 1,
                    pr: 1,
                  }}
                  variant="body2"
                  color="white"
                >
                  {category.name}
                </Typography>
              );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
