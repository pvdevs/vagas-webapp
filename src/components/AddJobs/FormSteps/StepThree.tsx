import { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';

import {
    Label,
    Container,
    SelectInput,
    ErrorMessage,
    TextArea,
    RadioInputContainer,
    RadioInput,
    ButtonSection,
    CancelButton,
    Button,
} from './styles';
import Select from 'react-select';

type IBGEUFResponse = {
    map(arg0: (uf: any) => JSX.Element): import('react').ReactNode;
    sigla: string;
    id: string;
    nome: string;
};

type IBGECITYResponse = {
    id: number;
    nome: string;
};

const StepThree = ({
    register,
    errors,
    trigger,
    watch,
    setValue,
    PreviousStep,
    onSubmit,
    setCompanyId,
}: any) => {
    const [ufs, setUfs] = useState<IBGEUFResponse[]>([]);
    const [cities, setCities] = useState<IBGECITYResponse[]>([]);
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedOptions, setSelectedOptions] = useState<any>([]);

    useEffect(() => {
        axios
            .get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/')
            .then((response) => {
                setUfs(response.data);
            });
        // setCompanyId(localStorage.getItem('authToken'));
    }, []);

    useEffect(() => {
        axios
            .get(
                `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`,
            )
            .then((response) => {
                setCities(response.data);
            });
    }, [selectedUf]);

    useEffect(() => {
        if (watch('modality') === 'Remoto') {
            setValue('city', '');
            setValue('federalUnit', '');
        }
    }, [watch('modality')]);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    const affirmativeTypeOptions = [
        { value: 'Mulheres Cis ou Trans', label: 'Mulheres Cis ou Trans' },
        { value: 'Pessoa preta ou parda', label: 'Pessoa preta ou parda' },
        { value: 'PCD', label: 'PCD' },
        { value: '60+', label: '60+' },
        { value: 'LGBTQIA+', label: 'LGBTQIA+' },
    ];

    return (
        <>
            <Container>
                <div>
                    <Label>*Modalidade</Label>
                    <SelectInput
                        {...register('modality')}
                        defaultValue=""
                        width={164}
                    >
                        <option value="" disabled hidden>
                            Selecione
                        </option>
                        <option value="Remoto">Remoto</option>
                        <option value="Híbrido">Híbrido</option>
                        <option value="Presencial">Presencial</option>
                    </SelectInput>
                    <ErrorMessage>
                        {errors.modality && <>{errors.modality.message}</>}
                    </ErrorMessage>
                </div>
                <div>
                    <Label>UF:</Label>
                    <SelectInput
                        {...register('federalUnit')}
                        name="federalUnit"
                        id="federalUnit"
                        onChange={(e) => {
                            setValue('federalUnit', e.target.value);
                            handleSelectUf(e);
                            trigger('federalUnit');
                        }}
                        defaultValue=""
                        width={126}
                        disabled={watch('modality') === 'Remoto'}
                    >
                        <option value="" disabled>
                            Selecione
                        </option>
                        {ufs.map((uf) => (
                            <option key={uf.id} value={uf.sigla}>
                                {uf.sigla}
                            </option>
                        ))}
                    </SelectInput>
                    <ErrorMessage>
                        {errors.federalUnit && (
                            <>{errors.federalUnit.message}</>
                        )}
                    </ErrorMessage>
                </div>
                <div>
                    <Label>Cidade: </Label>
                    <SelectInput
                        {...register('city')}
                        name="city"
                        id="city"
                        onChange={(e) => {
                            setValue('city', e.target.value);
                            trigger('city');
                        }}
                        defaultValue=""
                        width={205}
                        disabled={watch('modality') === 'Remoto'}
                    >
                        <option value="" disabled>
                            Selecione
                        </option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.nome}>
                                {city.nome}
                            </option>
                        ))}
                    </SelectInput>
                    <div className="text-red-600 text-sm text-center">
                        {errors.city && <>{errors.city.message}</>}
                    </div>
                </div>
            </Container>
            <Label htmlFor="benefits">Benefícios: </Label>
            <TextArea
                maxLength={3000}
                id="benefits"
                {...register('benefits')}
            />
            <ErrorMessage>
                {errors.benefits && <>{errors.benefits.message}</>}
            </ErrorMessage>

            <Label>*Essa é uma vaga afirmativa?</Label>
            <RadioInputContainer>
                <Label>
                    <RadioInput
                        {...register('affirmative')}
                        type="radio"
                        value="true"
                        defaultChecked
                        name="affirmative"
                    />
                    Sim
                </Label>
                <Label>
                    <RadioInput
                        {...register('affirmative')}
                        type="radio"
                        value="false"
                        name="affirmative"
                    />
                    Não
                </Label>
            </RadioInputContainer>
            <Label>Selecione o grupo minoritário</Label>
            <Select
                {...register('affirmativeType')}
                name="affirmativeType"
                isMulti
                options={affirmativeTypeOptions}
                value={selectedOptions}
                onChange={(selectedOptions: any) => {
                    setSelectedOptions(selectedOptions);
                }}
                onBlur={() =>
                    setValue(
                        'affirmativeType',
                        selectedOptions.map((option: any) => option.value),
                    )
                }
                placeholder="Selecione"
                isDisabled={watch('affirmative') === 'false'}
            />
            <ErrorMessage>
                {errors.affirmativeType && (
                    <>{errors.affirmativeType.message}</>
                )}
            </ErrorMessage>
            <ButtonSection>
                <CancelButton onClick={PreviousStep}>Voltar</CancelButton>
                <Button type="submit" onClick={onSubmit}>
                    Finalizar
                </Button>
            </ButtonSection>
        </>
    );
};

export default StepThree;
