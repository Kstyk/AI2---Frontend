import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useParams, useNavigate, Link } from 'react-router-dom';

import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  Modal,
  Box
} from '@mui/material';
import { MailOutline, Edit, Delete } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExperienceItem from './ExperienceItem';

const api = axios.create({
  baseURL: 'http://localhost:5072/api',
});

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [favoriteProfiles, setFavoriteProfiles] = useState(new Set());
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Przykładowe dane użytkownika
  /*const userData = {
    id: 2,
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    province: 'Mazowieckie',
    earnings: '60,000 PLN',
    specialties: ['Hydraulik', 'Tynkarz'],
    shortInfo: 'Jestem doświadczonym hydraulikiem i tynkarzem.',
    school: 'Politechnika Warszawska',
  };*/

  const [userData, setUserData] = useState({
    id: id,
    roleId: 0,
    email: '',
    firstName: null,
    lastName: null,
    aboutMe: null,
    education: null,
    voivodeship: null,
    requiredPayment: null,
    userQualifications: null,
    userExperiences: [],
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
        try {
          const response = await api.get(`/employees/${id}`);

          const user = response.data;
          setUserData(user);
        } catch (error) {
          console.error('Error fetching user profile:', error.message);
        }
    };
    fetchUserProfile();
  }, [userData]);

  const toggleFavorite = (profileId) => {
    const newFavoriteProfiles = new Set(favoriteProfiles);
    if (newFavoriteProfiles.has(profileId)) {
      newFavoriteProfiles.delete(profileId);
    } else {
      newFavoriteProfiles.add(profileId);
    }
    setFavoriteProfiles(newFavoriteProfiles);
  };

  const isFavorite = (profileId) => favoriteProfiles.has(profileId);

  const lastDayLogins = 10;
  const lastMonthLogins = 100;

  const handleAddToFavorites = () => {

  };

  const handleSendEmail = () => {
  };

  const handleDeleteProfile = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    navigate('/dashboard');
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };


  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader
          avatar={
            <Avatar>
              {userData.firstName?.charAt(0)}
              {userData.lastName?.charAt(0)}
            </Avatar>
          }
          title={`${userData.firstName} ${userData.lastName}`}
          subheader={`Województwo: ${userData.voivodeship}`}
          action={
            <div>
              <Button color='grey2'
                onClick={() => toggleFavorite(userData.id)}>
                {isFavorite(userData.id) ? (
                  <FavoriteIcon className="text-gray-600" />
                ) : (
                  <FavoriteBorderIcon className="text-gray-600" />
                )}
              </Button>
              <Link href={`/edit_profile/${userData.id}`}>
                <IconButton>
                  <Edit />
                </IconButton>
              </Link>
              <IconButton onClick={handleDeleteProfile}>
                <Delete />
              </IconButton>
            </div>
          }
        />
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Informacje o użytkowniku:
          </Typography>
          <Typography>Imię: {userData.firstName}</Typography>
          <Typography>Nazwisko: {userData.lastName}</Typography>
          <Typography>Email: {userData.email}</Typography>
          <Typography>Interesujące zarobki: {userData.requiredPayment}</Typography>
          <Typography>Specjalizacje: {userData.userQualifications}</Typography>
          <Typography>Krótki opis: {userData.aboutMe}</Typography>
          <Typography>Ukończona szkoła: {userData.education}</Typography>

          <div className="my-3">
            <Typography variant="subtitle1" gutterBottom>
              Doświadczenie:
            </Typography>
            {userData.userExperiences.map((experience) => (
              <ExperienceItem
                key={experience.id}
                from={experience.experience.startYear}
                to={experience.experience.endYear}
                company={experience.experience.company}
                description={experience.experience.description}
              />
            ))}
          </div>

          <Typography>Statystyki odwiedzin profilu:</Typography>
          <ul>
            <li>Ostatni dzień: {lastDayLogins} razy</li>
            <li>Ostatni miesiąc: {lastMonthLogins} razy</li>
          </ul>
        </CardContent>
        <div className="flex justify-end p-4">
          <Link to={`/mail_send/${id}`}>
            <Button
              startIcon={<MailOutline />}
              onClick={handleSendEmail}
              variant="contained"
              color="primary"
            >
              Wyślij maila
            </Button>
          </Link>
        </div>
      </Card>
      <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
        <Box className="bg-white border border-gray-200 p-4 rounded-md text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Typography variant="h6" gutterBottom>
            Czy na pewno chcesz usunąć swój profil?
          </Typography>
          <div className="mt-4 flex justify-center space-x-4">
            <Button
              variant="contained"
              color="info"
              onClick={handleCloseDeleteModal}
            >
              Nie
            </Button>
            <Button color="red" variant="contained" onClick={handleConfirmDelete}>
              Tak
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Profile;