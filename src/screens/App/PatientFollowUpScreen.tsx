import { Avatar, Box, IconButton, MenuItem, Step, StepContent, StepLabel, Stepper, Typography } from '@material-ui/core';
import { Section } from 'components/UI/Section';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router';
import moment from 'moment';
import { SummaryDescription } from 'components/UI/SummaryDescription';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ButtonMenu } from 'components/UI/ButtonMenu';
import { closeConfirmModal, enqueueSnackbar, openConfirmModal, setConfirmModalState } from 'redux/actions/ui';
import { Form } from 'components/UI/Form';
import { useForm } from 'hooks/useForm';
import { deletePatientEvent, updatePatient } from '../../redux/actions/patients';
import { v4 } from 'uuid';
import { Delete, Edit } from '@material-ui/icons';

export const PatientFollowUpScreen = () => {
  const { patientId } = useParams<UrlParams>();
  const { patients } = useSelector<RootState, PatientState>(state => state.patient);
  const patient = patients.find((_patient) => _patient._id === patientId);
  const [activeEvent, setActiveEvent] = useState<PatientEvent | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!activeEvent && !!patient && !!patient.events.length) setActiveEvent(patient.events[0]);
  }, [activeEvent, setActiveEvent, patient]);

  const onAddStudies = useCallback(() => {
    if (!patient) return;
    dispatch(setConfirmModalState({
      title: 'Agregar Estudios',
      content: <AddStudiesModal patient={patient} />,
      onConfirm: () => {
        const form = document.querySelector<HTMLFormElement>(`#add-studies-form`);
        if (!form) return false;
        form.dispatchEvent(new Event('submit', {
          'bubbles': true,
          'cancelable': true,
        }));
        return false;
      }
    }));
    dispatch(openConfirmModal());
  }, [dispatch, patient]);

  const onAddBiopsy = useCallback(() => {
    if (!patient) return;
    dispatch(setConfirmModalState({
      title: 'Agregar Biopsia',
      content: <AddBiopsyModal patient={patient} />,
      onConfirm: () => {
        const form = document.querySelector<HTMLFormElement>(`#add-biopsy-form`);
        if (!form) return false;
        form.dispatchEvent(new Event('submit', {
          'bubbles': true,
          'cancelable': true,
        }));
        return false;
      }
    }));
    dispatch(openConfirmModal());
  }, [dispatch, patient]);

  const onAddOncologicalCommittee = useCallback(() => {
    if (!patient) return;
    dispatch(setConfirmModalState({
      title: 'Agregar Comité Oncológico',
      fullWidth: true,
      size: 'sm',
      content: <AddOncologicalCommitteeModal patient={patient} />,
      onConfirm: () => {
        const form = document.querySelector<HTMLFormElement>(`#add-oncological-committee-form`);
        if (!form) return false;
        form.dispatchEvent(new Event('submit', {
          'bubbles': true,
          'cancelable': true,
        }));
        return false;
      }
    }));
    dispatch(openConfirmModal());
  }, [dispatch, patient]);

  const onAddPavilion = useCallback(() => {
    if (!patient) return;
    dispatch(setConfirmModalState({
      title: 'Agregar Información de Pabellón',
      fullWidth: true,
      size: 'sm',
      content: <AddPavilionModal patient={patient} />,
      onConfirm: () => {
        const form = document.querySelector<HTMLFormElement>(`#add-pavilion-form`);
        if (!form) return false;
        form.dispatchEvent(new Event('submit', {
          'bubbles': true,
          'cancelable': true,
        }));
        return false;
      }
    }));
    dispatch(openConfirmModal());
  }, [dispatch, patient]);

  const onAddFollowUps = useCallback(() => {
    if (!patient) return;
    dispatch(setConfirmModalState({
      title: 'Agregar Información de Seguimiento',
      fullWidth: true,
      size: 'sm',
      content: <AddFollowUpsModal patient={patient} />,
      onConfirm: () => {
        const form = document.querySelector<HTMLFormElement>(`#add-follow-ups-form`);
        if (!form) return false;
        form.dispatchEvent(new Event('submit', {
          'bubbles': true,
          'cancelable': true,
        }));
        return false;
      }
    }));
    dispatch(openConfirmModal());
  }, [dispatch, patient]);

  const eventOptionsDict = useMemo(() => {
    return {
      'entry': { label: 'Ingreso', onSelect: () => console.log('entry') },
      'studies': { label: 'Estudios', onSelect: onAddStudies },
      'biopsy': { label: 'Biopsia', onSelect: onAddBiopsy },
      'oncological-committee': { label: 'Comité Oncológico', onSelect: onAddOncologicalCommittee },
      'pavilion': { label: 'Pabellón', onSelect: onAddPavilion },
      'follow-ups': { label: 'Seguimiento', onSelect: onAddFollowUps },
    };
  }, [onAddStudies, onAddBiopsy, onAddOncologicalCommittee, onAddPavilion, onAddFollowUps]);

  if (!patient || (!!patient && !patient.events.length)) return <Redirect to={'/app/home'} />;

  const renderStepperTitle = (event: PatientEvent) => {

    const onDelete: React.MouseEventHandler<HTMLButtonElement> = (e) => {
      e.preventDefault();
      dispatch(deletePatientEvent(patient._id, event));
      e.stopPropagation();
    };

    return <Box display='flex' justifyContent='space-between'>
      <Box>
        <Typography variant='body2' style={{ fontWeight: 'bold' }}>{`${eventOptionsDict[event.type] ? eventOptionsDict[event.type].label : 'Evento Desconocido'}`}</Typography>
        <Typography variant='body2'>{`${!!event.datetime ? `${moment(new Date(event.datetime)).format('DD-MM-yyyy [a las] HH:mm')}` : ''}`}</Typography>
      </Box>
      <Box>
        {event.type !== 'entry' &&
          <IconButton>
            <Edit />
          </IconButton>
        }
        {event.type !== 'entry' &&
          <IconButton onClick={onDelete}>
            <Delete />
          </IconButton>
        }
      </Box>
    </Box>;
  };

  const renderFilePreview = (file: File) => {
    let extension: RegExpMatchArray | string | null = file.name.match(/(?:\.([^.]+))?$/);
    if (!extension) return null;
    extension = extension[1].replace(/\./, '');
    if (extension === 'pdf') return <Box key={v4()} display='flex' width='100px' flexDirection='column' margin='5px' >
      <Box style={{
        width: 100,
        height: 100,
        padding: '25px',
        background: `url(https://pixy.org/download/4205007/)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }} />
      <Typography variant='caption'>{file.name}</Typography>
    </Box>;
    else return <Box key={v4()} display='flex' width='100px' flexDirection='column' margin='5px' >
      <Box style={{
        width: 100,
        height: 100,
        padding: '25px',
        background: `url(${URL.createObjectURL(file)})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }} />
      <Typography variant='caption'>{file.name}</Typography>
    </Box>;
  };

  const renderStepperContent = (event: PatientEvent) => {
    switch (event.type) {
      case 'entry':
        return <SummaryDescription
          headerPercentage={15}
          columns={[{
            'Nombre:': { value: `${patient.name}` },
            'Edad:': { value: `${patient.age}` },
            'Previsión:': { value: `${patient.prevision}` },
            'Derivado desde:': { value: `${patient.derivedFrom}` },
            'Razón derivación:': { value: `${patient.reason}` },
            'Antecedentes médicos:': { value: `${patient.history}` },
            'Historia clínica:': { value: `${patient.observation}` },
          }]}
        />;

      case 'studies':
        return (<Box display='flex' flexWrap='wrap'>
          {!!event.data.images.length &&
            <Section label='Estudio Imágenes' style={{ width: '100%' }}>
              {(event.data as Studies).images.map((image) => renderFilePreview(image)).filter((i) => !!i)}
            </Section>
          }
          {!!event.data.exams.length &&
            <Section label='Exámenes Generales' style={{ width: '100%' }}>
              {(event.data as Studies).exams.map((exam) => renderFilePreview(exam)).filter((i) => !!i)}
            </Section>
          }
        </Box>);

      case 'biopsy':
        return (<Box display='flex' flexWrap='wrap'>
          <Section label='Detalle Biopsia' style={{ width: '100%', marginBottom: 30 }}>
            <Typography style={{ whiteSpace: 'pre-line' }}>{(event.data as Biopsy).detail}</Typography>
          </Section>
          <Section label='Resultados' style={{ width: '100%' }}>
            {(event.data as Biopsy).results.map((result) => renderFilePreview(result)).filter((i) => !!i)}
          </Section>
        </Box>);

      case 'oncological-committee':
        return (<Box display='flex' flexWrap='wrap'>
          <Section label='Detalle Comité Oncológico' style={{ width: '100%' }}>
            <Typography style={{ whiteSpace: 'pre-line' }}>{(event.data as OncologicalCommittee).detail}</Typography>
          </Section>
        </Box>);

      case 'pavilion':
        return (<Box display='flex' flexWrap='wrap'>
          <Section label='Detalle de Intervención' style={{ width: '100%', marginBottom: 30 }}>
            <Typography style={{ whiteSpace: 'pre-line' }}>{(event.data as Pavilion).intervention}</Typography>
          </Section>
          <Section label='Documentos Intervención' style={{ width: '100%', marginBottom: 30 }}>
            {
              !!(event.data as Pavilion).docs.length ? (event.data as Pavilion).docs.map((doc) => renderFilePreview(doc)).filter((i) => !!i) : <Typography>Sin documentos</Typography>
            }
          </Section>
          <Section label='Detalle de Complicaciones' style={{ width: '100%' }}>
            <Typography style={{ whiteSpace: 'pre-line' }}>{(event.data as Pavilion).complications}</Typography>
          </Section>
        </Box>);
      case 'follow-ups':
        const followUps: FollowUps = event.data;
        return (<Box display='flex' flexWrap='wrap'>
          <Section label={{
            'two-weeks': 'Control a las 2 semanas',
            'one-month': 'Control al mes',
            'three-months': 'Control a los 3 meses',
            'six-months': 'Control a los 6 meses',
            'one-year': 'Control al año',
          }[followUps.term]} style={{ width: '100%', marginBottom: 30 }}>
            <Typography style={{ whiteSpace: 'pre-line' }}>{followUps.detail}</Typography>
          </Section>
          {!!followUps.files.length &&
            <Section label='Documentos del Control' style={{ width: '100%', marginBottom: 30 }}>
              {
                followUps.files.map((file) => renderFilePreview(file)).filter((i) => !!i)
              }
            </Section>
          }
        </Box>);
      default:
        return <div></div>;
    }
  };

  const activeStep = () => {
    if (!activeEvent || !patient.events) return -1;
    const activeIndex = patient.events.findIndex((event) => event._id === activeEvent._id);
    return activeIndex;
  };

  const handleStep = (step: number, event: PatientEvent) => () => {
    if (event._id === activeEvent?._id) return;
    // if (event._id === activeEvent?._id) return setActiveEvent(null);
    setActiveEvent(event);
  };

  return (<>
    <Section label={patient.name}>
      <Box width='100%'>
        <Stepper id='stepper' nonLinear activeStep={activeStep()} orientation='vertical' style={{ width: '100%', padding: '16px 24px', backgroundColor: 'white' }}>
          {patient.events.map((event, index) => (
            <Step id={`event-${event._id}`} style={{ width: '100%', paddingTop: 5 }} key={event._id} active={activeStep() === index}>
              <StepLabel
                style={{ width: '100%', paddingBottom: 5, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
                icon={index + 1}
                onClick={handleStep(index, event)}
              >
                {renderStepperTitle(event)}
              </StepLabel>
              <StepContent transitionDuration={200}>
                {renderStepperContent(event)}
              </StepContent>
            </Step>
          ))}
          <Step id='add-event' style={{ width: '100%', paddingTop: 5 }} key='add-event'>
            <StepLabel
              style={{ width: '100%', paddingBottom: 5, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
              icon={<Box width={0} />}
            >
              <Box display='flex' alignItems='center'>
                <ButtonMenu
                  buttonStyle={{ marginLeft: -8, marginRight: 8 }}
                  text='Agregar Evento'
                  buttonVariant='text'
                  icon={<Avatar style={{ width: 24, height: 24, backgroundColor: 'white', color: 'black', border: '1px dashed black' }} >+</Avatar>}
                  options={Object.entries(eventOptionsDict).map(([key, value]: [string, Dict]) => {
                    return {
                      ...value,
                      disabled: patient.events.some((event) => event.type === key && event.type !== 'follow-ups'),
                    };
                  })}
                />
              </Box>
            </StepLabel>
          </Step>
        </Stepper>
      </Box>
    </Section>
  </>);
};

const initialAddStudiesForm = {
  images: [] as File[],
  exams: [] as File[],
};

interface AddPatientEventModalProps {
  patient: Patient;
};

const AddStudiesModal: React.FC<AddPatientEventModalProps> = ({ patient }) => {
  const { form, handleInputChange } = useForm(initialAddStudiesForm);
  const dispatch = useDispatch();

  const onSubmit = useCallback((form: typeof initialAddStudiesForm) => {
    if (!form.images.length && !form.exams.length) return dispatch(enqueueSnackbar({ message: `Los archivos son requeridos`, options: { variant: 'error', autoHideDuration: 5000 } }));
    dispatch(updatePatient({
      ...patient,
      events: [...patient.events, ({
        _id: v4(),
        type: 'studies',
        data: {
          ...form,
        },
        datetime: new Date(),
      } as PatientEvent<Studies>)]
    }));
    dispatch(closeConfirmModal());
  }, [dispatch, patient]);

  return (
    <>
      <Form form={form} onChange={handleInputChange} id='add-studies-form' onSubmit={onSubmit}>
        <Form.Input label='Arrastra un archivo para subir a estudios' type='file' fullWidth
          validate={(value: File[]) => {
            if (!value.length && !form.exams.length) return 'El campo es requerido';
            return '';
          }}
        />
        <Form.Input label='Arrastra un archivo para subir a exámenes generales' type='file' acceptedFiles={['.pdf']} fullWidth
          validate={(value: File[]) => {
            if (!value.length && !form.images.length) return 'El campo es requerido';
            return '';
          }}
        />
      </Form>
    </>
  );
};

const initialAddBiopsy = {
  detail: '' as string,
  results: [] as File[],
};

const AddBiopsyModal: React.FC<AddPatientEventModalProps> = ({ patient }) => {
  const { form, handleInputChange } = useForm(initialAddBiopsy);
  const dispatch = useDispatch();

  const onSubmit = useCallback((form: typeof initialAddBiopsy) => {
    if (!form.results.length) return dispatch(enqueueSnackbar({ message: `Los archivos son requeridos`, options: { variant: 'error', autoHideDuration: 5000 } }));
    dispatch(updatePatient({
      ...patient,
      events: [...patient.events, ({
        _id: v4(),
        type: 'biopsy',
        data: {
          ...form,
        },
        datetime: new Date(),
      } as PatientEvent<Biopsy>)]
    }));
    dispatch(closeConfirmModal());
  }, [dispatch, patient]);

  return (
    <>
      <Form form={form} onChange={handleInputChange} id='add-biopsy-form' onSubmit={onSubmit}>
        <Form.Input label='Detalle' type='textarea' max={2000} variant='outlined' placeholder='Ingresa detalle' fullWidth
          validate={(value: string) => {
            if (!value) return 'El campo es requerido';
            return '';
          }}
        />
        <Form.Input label='Arrastra un archivo para subir los resultados' type='file' acceptedFiles={['.pdf']} fullWidth
          validate={(value: File[]) => {
            if (!value.length) return 'El campo es requerido';
            return '';
          }}
        />
      </Form>
    </>
  );
};

const initialAddOncologicalCommittee = {
  detail: '' as string,
};

const AddOncologicalCommitteeModal: React.FC<AddPatientEventModalProps> = ({ patient }) => {
  const { form, handleInputChange } = useForm(initialAddBiopsy);
  const dispatch = useDispatch();

  const onSubmit = useCallback((form: typeof initialAddOncologicalCommittee) => {
    dispatch(updatePatient({
      ...patient,
      events: [...patient.events, ({
        _id: v4(),
        type: 'oncological-committee',
        data: {
          ...form,
        },
        datetime: new Date(),
      } as PatientEvent<OncologicalCommittee>)]
    }));
    dispatch(closeConfirmModal());
  }, [dispatch, patient]);

  return (
    <>
      <Form form={form} onChange={handleInputChange} id='add-oncological-committee-form' onSubmit={onSubmit}>
        <Form.Input label='Detalle' type='textarea' max={2000} variant='outlined' placeholder='Ingresa detalle' fullWidth
          validate={(value: string) => {
            if (!value) return 'El campo es requerido';
            return '';
          }}
        />
      </Form>
    </>
  );
};

const initialAddPavilion = {
  intervention: '' as string,
  docs: [] as File[],
  complications: '' as string,

};

const AddPavilionModal: React.FC<AddPatientEventModalProps> = ({ patient }) => {
  const { form, handleInputChange } = useForm(initialAddPavilion);
  const dispatch = useDispatch();

  const onSubmit = useCallback((form: typeof initialAddPavilion) => {
    dispatch(updatePatient({
      ...patient,
      events: [...patient.events, ({
        _id: v4(),
        type: 'pavilion',
        data: {
          ...form,
        },
        datetime: new Date(),
      } as PatientEvent<Pavilion>)]
    }));
    dispatch(closeConfirmModal());
  }, [dispatch, patient]);

  return (
    <>
      <Form form={form} onChange={handleInputChange} id='add-pavilion-form' onSubmit={onSubmit}>
        <Form.Input label='Intervención' type='textarea' max={2000} variant='outlined' placeholder='Ingresa detalle de intervención' fullWidth
          validate={(value: string) => {
            if (!value) return 'El campo es requerido';
            return '';
          }}
        />
        <Form.Input label='Arrastra un archivo pdf para adjuntar a las intervenciones' type='file' acceptedFiles={['.pdf']} fullWidth
          validate={(value: File[]) => {
            if (!value.length) return 'El campo es requerido';
            return '';
          }}
        />
        <Form.Input label='Complicaciones' type='textarea' max={2000} variant='outlined' placeholder='Ingresa detalle de complicaciones' fullWidth
          validate={(value: string) => {
            if (!value) return 'El campo es requerido';
            return '';
          }}
        />
      </Form>
    </>
  );
};

const initialAddFollowUps = {
  term: 'placeholder' as string,
  detail: '' as string,
  files: [] as File[],
};

const AddFollowUpsModal: React.FC<AddPatientEventModalProps> = ({ patient }) => {
  const { form, handleInputChange } = useForm(initialAddFollowUps);
  const dispatch = useDispatch();

  const onSubmit = useCallback((form: typeof initialAddFollowUps) => {
    dispatch(updatePatient({
      ...patient,
      events: [...patient.events, ({
        _id: v4(),
        type: 'follow-ups',
        data: {
          ...form,
        },
        datetime: new Date(),
      } as PatientEvent<FollowUps>)]
    }));
    dispatch(closeConfirmModal());
  }, [dispatch, patient]);

  return (
    <>
      <Form form={form} onChange={handleInputChange} id='add-follow-ups-form' onSubmit={onSubmit}>
        <Form.Input label='Control' type='select' placeholder='Seleccione un lapso de tiempo' fullWidth
          validate={(value: string) => {
            if (!value || value === 'placeholder') return 'El campo es requerido';
            return '';
          }}
        >
          <MenuItem value='two-weeks'>2 semanas</MenuItem>
          <MenuItem value='one-month'>1 mes</MenuItem>
          <MenuItem value='three-months'>3 meses</MenuItem>
          <MenuItem value='six-months'>6 meses</MenuItem>
          <MenuItem value='one-year'>1 año</MenuItem>
        </Form.Input>
        <Form.Input label='Complicaciones' type='textarea' max={2000} variant='outlined' placeholder='Ingresa detalle de complicaciones' fullWidth
          validate={(value: string) => {
            if (!value) return 'El campo es requerido';
            return '';
          }}
        />
        <Form.Input label='Arrastra una imagen o archivo pdf para adjuntar al control' type='file' acceptedFiles={['.pdf', 'image/*']} fullWidth
          validate={(value: File[]) => {
            if (!value.length && form.term !== 'two-weeks') return 'El campo es requerido';
            return '';
          }}
        />
      </Form>
    </>
  );
};