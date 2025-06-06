import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HotelCard = ({ hotel, onDelete }) => {
  const navigate = useNavigate();

  const trimmedTitle =
    hotel.hotel_title?.length > 25
      ? hotel.hotel_title.slice(0, 25) + '...'
      : hotel.hotel_title;

  return (
    <Card
      sx={{
        width: {
          xs: '90vw',  // Mobile view: almost full width
          sm: '100%',  // Tablet view: stretch fully in container
          md: 314,     // Fixed width on laptops and above
        },
        height: {
          xs: 280,
          sm: 250,
          md: 250,
        },
        m: 2,
        cursor: 'pointer',
        maxWidth: '100%',
      }}
    >
      <CardMedia
        component="img"
        height="100"
        image={`http://localhost:5000${hotel.hotel_image_url}`}
        alt={hotel.hotel_title ? `Image of ${hotel.hotel_title}` : 'Hotel image'}
        onClick={() => navigate(`/hotels/${hotel.hotel_id}`)}
        sx={{ cursor: 'pointer' }}
      />
      <CardContent
        onClick={() => navigate(`/hotels/${hotel.hotel_id}`)}
        sx={{ cursor: 'pointer', p: 0 }}
      >
        <Tooltip
          title={hotel.hotel_title || ''}
          disableHoverListener={(hotel.hotel_title?.length || 0) <= 20}
        >
          <Typography
            sx={{
              pl: '20px',
              pt: '10px',
              fontSize: {
                xs: '18px',
                sm: '20px',
                md: '20px',
              },
              color: '#0A2540',
            }}
          >
            {trimmedTitle}
          </Typography>
        </Tooltip>

        <Typography
          color="text.secondary"
          sx={{
            fontSize: {
              xs: '14px',
              sm: '15px',
              md: '15px',
            },
            pl: '24px',
            pt: '5px',
          }}
        >
          ₹{hotel.hotel_price}
        </Typography>

        <Typography
          sx={{
            height: '30px',
            fontSize: {
              xs: '9px',
              sm: '10px',
              md: '10px',
            },
            pl: '24px',
            pr: '14px',
            pt: '5px',
          }}
        >
          {hotel.hotel_description?.slice(0, 100)}...
        </Typography>
      </CardContent>

      <CardActions sx={{ pl: '20px' }}>
        <Button
          size="small"
          onClick={() => navigate(`/hotels/edit/${hotel.hotel_id}`)}
          sx={{
            textTransform: 'none',
            color: 'black',
            '&:hover': { color: 'white', background: '#0A2540' },
          }}
        >
          Edit
        </Button>
        <Button
          size="small"
          sx={{
            textTransform: 'none',
            color: 'black',
            '&:hover': { color: 'white', background: '#0A2540' },
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default HotelCard;
