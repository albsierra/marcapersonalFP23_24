import {
    List,
    SimpleList,
    Datagrid,
    TextField,
    ReferenceField,
    Edit,
    Create,
    SimpleForm,
    ReferenceInput,
    TextInput,
    NumberField,
    NumberInput,
    FunctionField,
    FileInput, FileField,
    ShowButton,
    Show,
    SimpleShowLayout,
    AutocompleteInput,
    SaveButton,
    ListButton,
    TopToolbar,
    ExportButton,
    FilterButton,
    Toolbar,
    useEditContext
  } from 'react-admin';

import { useRecordContext} from 'react-admin';
import { useMediaQuery, Button, Box } from '@mui/material';
import { RenderCreateButton, RenderEditButton, RenderDeleteButton, RenderExportButton } from '../Components/BotonesPermissions';
import { UserListMini, UserListMiniSelected} from '../Pages/Users';
import DropDownComponent from '../../Pages/front/src/componentes/DropDownComponent';
import { CicloListMini, CicloListMiniSelected } from './Ciclos';

const ListActions = () => (
    <TopToolbar>
        <FilterButton/>
        <RenderCreateButton permisos={{ role: 'docente' }} />
        <RenderExportButton permisos={{ role: "docente" }}/>
    </TopToolbar>
);

const EditActions = () => (
    <Toolbar>
      <div className="RaToolbar-defaultToolbar">
        <SaveButton/>
        <RenderDeleteButton />
      </div>
    </Toolbar>
);

const TutorInput = () => (
    <ReferenceInput label="Tutor" source="docente_id" reference="docentes" alwaysOn >
        <AutocompleteInput
        label="Tutor"
        source="docente_id"
        optionText={record => record && `${record.nombre} ${record.apellidos}`} />
    </ReferenceInput>
)
const proyectosFilters = [
    <TextInput source="q" label="Search" alwaysOn />,
    TutorInput(),
];

export const ProyectoList = () => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    <List filters={proyectosFilters} actions={<ListActions />} >
      {isSmall ? (
        <SimpleList
          primaryText="%{nombre}"
          secondaryText="%{dominio}"
          tertiaryText="%{calificacion}"
          linkType={(record) => (record.canEdit ? 'edit' : 'show')}
        >
          <RenderEditButton />
          <RenderDeleteButton />
        </SimpleList>
      ) : (
        <Datagrid bulkActionButtons={false} >
          <TextField source="id" />
          <TextField source="nombre" />
          <TextField source="dominio" />
          <ReferenceField label="Tutor" source="docente_id" reference="users">
            <FunctionField render={record => record && `${record.nombre} ${record.apellidos}`} />
          </ReferenceField>
          <NumberField source="calificacion" />
          <ShowButton />
          <RenderEditButton />
          <RenderDeleteButton />
        </Datagrid>
      )}
    </List>
  );
}

export const ProyectoTitle = () => {
  const record = useRecordContext();
  return <span>Proyecto {record ? `"${record.nombre}"` : ''}</span>;
};

export const DownloadTemplateProject = () => {
  const fileUrl = import.meta.env.VITE_PROJECT_TEMPLATE_URL;

  return (
    <a href={fileUrl} download>
      <Button variant="contained" color="primary">
        Descargar plantilla de proyecto
      </Button>
    </a>
  );
}

export const ProyectoEdit = () => {
  const record = useRecordContext();

  return (
    <Edit title={<ProyectoTitle />}>
    <SimpleForm toolbar={<EditActions />} >
        <TextInput source="id" disabled />
        <TextInput source="nombre" />
        <TextInput source="dominio" />
        <TutorInput />
        <NumberInput source="calificacion" />
        <FileInput  source="attachments"
                    label="Archivo comprimido con el proyecto"
                    sx={{'& .RaFileInput-dropZone':{textAlign:'left'}}}>
            <FileField  source="src" title="title" />
        </FileInput>

    </SimpleForm>
    <Box display="block" textAlign="center">
        <DownloadTemplateProject />
    </Box>
    <Box display="block" textAlign="center">
      <UserListMiniSelected></UserListMiniSelected>
      <DropDownComponent message="Añade participantes al proyecto">
          <UserListMini proyecto={record} />
      </DropDownComponent>
    </Box>
        <Box display="block" textAlign="center">
            <CicloListMiniSelected />
            <DropDownComponent message="Indica los ciclos asociados al proyecto">
                <CicloListMini />
            </DropDownComponent>
        </Box>
    </Edit>
  );
}

export const ProyectoShow = () => (
    <Show actions={<ListButton />} >
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="nombre" />
            <TextField source="dominio" />
            <ReferenceField label="Tutor" source="docente_id" reference="users">
                <FunctionField render={record => record && `${record.nombre} ${record.apellidos}`} />
            </ReferenceField>
            <NumberField source="calificacion" />
        </SimpleShowLayout>
    </Show>
);

export const ProyectoCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="nombre" />
            <TextInput source="dominio" />
            <TutorInput />
            <NumberInput source="calificacion" />
        </SimpleForm>
    </Create>
);
