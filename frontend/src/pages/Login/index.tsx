import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { ILogin, postSingIn } from '../../api/user';
import { useAuthContext } from '../../hooks/useAuth';
import { useNavigation } from 'react-router-dom';
import { LinearProgress } from '@mui/material';

const Login = () => {
  const navigation = useNavigation();
  const { login: onSignIn } = useAuthContext();
  const [login, setLogin] = useState<ILogin>({
    email: 'admin@email.com',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const signIn = (formEvent: React.FormEvent) => {
    formEvent.preventDefault();
    postSingIn(login).then(onSignIn, () => {
      setError('Email não encontrado ou senha incorreta');
    });
  };

  const isloading = navigation.state === 'loading';

  return (
    <Container maxWidth="sm" component="form" onSubmit={signIn}>
      <Box component="h1">Agenda React</Box>
      <Box component="p">
        Digite e-mail e senha para entrar no sistema. Para testar, use o email{' '}
        <kbd>admin@email.com</kbd> e a senha <kbd>1234</kbd>.
      </Box>
      <TextField
        variant="outlined"
        autoFocus
        required
        margin="normal"
        label="E-mails"
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={login.email}
        onChange={changeEvent =>
          setLogin(prev => ({ ...prev, email: changeEvent.target.value }))
        }
      />
      <TextField
        type="password"
        variant="outlined"
        autoFocus
        required
        margin="normal"
        label="Senha"
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={login.password}
        onChange={changeEvent =>
          setLogin(prev => ({ ...prev, password: changeEvent.target.value }))
        }
      />
      {error && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity="info">{error}</Alert>
        </Stack>
      )}
      {isloading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      )}
      <Box textAlign="right" marginTop="16px">
        <Button
          disabled={isloading}
          variant="contained"
          color="primary"
          type="submit"
        >
          Entrar
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
