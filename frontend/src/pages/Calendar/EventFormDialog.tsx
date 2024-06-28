import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { InputLabel } from '@mui/material';
import {
  IEdittingEvent,
  postEvent,
  putEvent,
  deleteEvent,
} from '../../api/event';
import { ICalendar } from '../../api/calendar';

interface IEventFormDialogProps {
  event: IEdittingEvent | null;
  calendars: ICalendar[];
  onCancel: () => void;
  onSave: () => void;
}

const EventFormDialog = (props: IEventFormDialogProps) => {
  console.log('Componente EventFormDialog foi chamado!');
  const { event, calendars, onCancel, onSave } = props;
  const [edittingEvent, setEdittingEvent] = useState<IEdittingEvent | null>(
    event
  );

  useEffect(() => {
    setEdittingEvent(event);
  }, [event]);

  const isNew = !edittingEvent?.id;

  const onDeleteEvent = (mouseEvent: React.MouseEvent) => {
    mouseEvent.preventDefault();
    if (edittingEvent) {
      deleteEvent(edittingEvent).then(onSave);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={!!event}
        onClose={onCancel}
        PaperProps={{
          component: 'form',
          onSubmit: (formEvent: React.FormEvent<HTMLFormElement>) => {
            formEvent.preventDefault();
            if (edittingEvent) {
              if (isNew) {
                postEvent(edittingEvent).then(onSave);
              } else {
                putEvent(edittingEvent).then(onSave);
              }
            }
          },
        }}
      >
        <DialogTitle>{isNew ? 'Criar Evento' : 'Editar Evento'}</DialogTitle>
        <DialogContent>
          {edittingEvent && (
            <React.Fragment>
              <TextField
                type="date"
                required
                margin="normal"
                label="Data"
                value={edittingEvent?.date}
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={e =>
                  setEdittingEvent({ ...edittingEvent, date: e.target.value })
                }
              />
              <TextField
                autoFocus
                required
                margin="normal"
                label="Descrição"
                value={edittingEvent?.desc}
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={e =>
                  setEdittingEvent({ ...edittingEvent, desc: e.target.value })
                }
              />
              <TextField
                type="time"
                margin="normal"
                label="Hora"
                value={edittingEvent?.time ?? ''}
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={e =>
                  setEdittingEvent({ ...edittingEvent, time: e.target.value })
                }
              />
              <FormControl required margin="normal" fullWidth>
                <InputLabel id="select-caledar">Agenda</InputLabel>
                <Select
                  labelId="select-caledar"
                  label="Agenda"
                  value={edittingEvent?.calendarId}
                  onChange={e =>
                    setEdittingEvent({
                      ...edittingEvent,
                      calendarId: e.target.value as number,
                    })
                  }
                >
                  {calendars.map(({ id, name }) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </React.Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Box margin="10px">
            {!isNew && <Button onClick={onDeleteEvent}>Excluir</Button>}
            <Button onClick={onCancel}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </Box>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default EventFormDialog;
