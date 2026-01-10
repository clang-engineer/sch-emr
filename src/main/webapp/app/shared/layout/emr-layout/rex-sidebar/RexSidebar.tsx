import * as React from 'react';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import {
  faGrid,
  faChartMixed,
  faCircleQuestion,
  faHouseChimney,
  faMagnifyingGlass,
  faAddressCard,
  faGear,
  faClipboardMedical,
} from '@fortawesome/pro-solid-svg-icons';
import Header from '../Header';
// import { useSelector } from '../../store';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import axios from 'axios';

const RexSideBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const header = () => {
    return (
      <Toolbar sx={{ height: '48px' }}>
        <Header />
      </Toolbar>
    );
  };

  const goToRex = () => {
    axios.get('api/user/token').then(({ data }) => {
      window.location.href = `https://supreme.snuh.org/sso?token=${data.token}`;
    });
  };

  const getFont = (value: string) => {
    if (isOpen)
      return (
        <Typography fontSize={20} fontWeight={'bold'} color="white" marginLeft={1} display={'flex'} alignItems={'center'}>
          {value}
        </Typography>
      );
  };

  return (
    <React.Fragment>
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{ background: theme.palette.background.default, ml: '48px', zIndex: 1 }}
      >
        {header()}
      </AppBar>

      {/* Platform Sidebar */}
      <Box
        sx={{
          zIndex: 2,
          position: 'fixed',
          top: 0,
          left: 0,
          width: isOpen ? 338 : 48,
          height: '100vh',
          backgroundColor: '#3f51b5',
        }}
      >
        <Box
          height={55}
          display={'flex'}
          alignItems={'center'}
          sx={{ cursor: 'pointer', padding: '0 14px' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* <FontAwesomeIcon icon={faGrid} size='xl' style={{ color: 'white' }} /> */}
          <FontAwesomeIcon icon={['fas', 'grid']} size="xl" style={{ color: 'white' }} />
        </Box>
        <Box height={55} display={'flex'} alignItems={'center'} sx={{ cursor: 'pointer', padding: '0 14px' }} onClick={goToRex}>
          {/* <FontAwesomeIcon icon={faHouseChimney} size='lg' style={{ color: 'white' }} /> */}
          <FontAwesomeIcon icon={['fas', 'house-chimney']} size="lg" style={{ color: 'white' }} />
          {getFont('SUPREME 2.0')}
        </Box>
        <Box
          height={55}
          display={'flex'}
          alignItems={'center'}
          sx={{ cursor: 'pointer', padding: '0 14px' }}
          onClick={() => (window.location.href = 'https://supreme.snuh.org/case-design')}
        >
          {/* <FontAwesomeIcon icon={faMagnifyingGlass} size='lg' style={{ color: 'white' }} /> */}
          <FontAwesomeIcon icon={['fas', 'magnifying-glass']} size="lg" style={{ color: 'white' }} />
          {getFont('연구검색')}
        </Box>
        <Box
          height={55}
          display={'flex'}
          alignItems={'center'}
          sx={{ cursor: 'pointer', padding: '0 14px' }}
          onClick={() => (window.location.href = 'https://cohortmarts.snuh.org/')}
        >
          {/* <FontAwesomeIcon icon={faChartMixed} size='lg' style={{ color: 'white' }} /> */}
          <FontAwesomeIcon icon={['fas', 'chart-mixed']} size="lg" style={{ color: 'white' }} />
          {getFont('코호트 마트')}
        </Box>
        <Box
          height={55}
          display={'flex'}
          alignItems={'center'}
          sx={{ cursor: 'pointer', padding: '0 14px' }}
          onClick={() => (window.location.href = 'https://rid.snuh.org/')}
        >
          {/* <FontAwesomeIcon icon={faAddressCard} size='lg' style={{ color: 'white' }} /> */}
          <FontAwesomeIcon icon={['fas', 'address-card']} size="lg" style={{ color: 'white' }} />
          {getFont('가명화 시스템')}
        </Box>
        <Box
          height={55}
          display={'flex'}
          alignItems={'center'}
          sx={{ cursor: 'pointer', padding: '0 15px' }}
          onClick={() => (window.location.href = 'https://deview.snuh.org/')}
        >
          {/* <FontAwesomeIcon icon={faClipboardMedical} size='xl' style={{ color: 'white' }} /> */}
          <FontAwesomeIcon icon={['fas', 'clipboard-medical']} size="xl" style={{ color: 'white' }} />
          {getFont('가명의무기록 뷰어')}
        </Box>
        <Box
          height={55}
          display={'flex'}
          alignItems={'center'}
          sx={{ cursor: 'pointer', padding: '0 14px' }}
          onClick={() => (window.location.href = 'http://172.26.33.22:18081/')}
        >
          {/* <FontAwesomeIcon icon={faCircleQuestion} size='lg' style={{ color: 'white' }} /> */}
          <FontAwesomeIcon icon={['fas', 'circle-question']} size="lg" style={{ color: 'white' }} />
          {getFont('Help Center')}
        </Box>
        {isAdmin && (
          <Box
            height={55}
            display={'flex'}
            alignItems={'center'}
            sx={{ cursor: 'pointer', padding: '0 14px' }}
            onClick={() => navigate('/report')}
          >
            {/* <FontAwesomeIcon icon={faGear} size='lg' style={{ color: 'white' }} /> */}
            <FontAwesomeIcon icon={['fas', 'gear']} size="lg" style={{ color: 'white' }} />
            {getFont('관리자 페이지')}
          </Box>
        )}
      </Box>
    </React.Fragment>
  );
};

export default RexSideBar;
