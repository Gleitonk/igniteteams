import { useEffect, useState, useRef } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Alert, FlatList, TextInput } from "react-native";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";

import { AppError } from "@utils/AppError";


import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playersGetByGroupAndTeam";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";
import { Loading } from "@components/Loading";

type RouteParams = {
    group: string;
}

export function Players() {
    const [isLoading, setIsLoading] = useState(true);

    const [newPlayerName, setNewPlayerName] = useState('');
    const [team, setTeam] = useState('TIME A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

    const route = useRoute();
    const { group } = route.params as RouteParams;

    const newPlayerNameInputRef = useRef<TextInput>(null);

    const navigation = useNavigation();

    async function handleAddPlayer() {
        if (newPlayerName.trim().length === 0) {
            return Alert.alert('Novo plyer', 'Informe o nome do player para adicionar.');
        }

        const newPlayer = {
            name: newPlayerName,
            team
        }

        try {
            await playerAddByGroup(newPlayer, group);

            newPlayerNameInputRef.current?.blur();

            fetchPlayersByTeam();
            setNewPlayerName('');
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Novo plyer', error.message);
            } else {
                console.log(error);
                Alert.alert('Novo plyer', 'Não foi possível adicionar este player.');
            }
        }
    }

    async function fetchPlayersByTeam() {
        try {
            setIsLoading(true);

            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);

        } catch (error) {
            console.log(error);
            Alert.alert('Novo player', 'Não foi possível carregar jogadores.');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleRemovePlayer(playerName: string) {
        try {
            await playerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();
        } catch (error) {
            Alert.alert('Novo plyer', 'Não foi possível remover este jogador');
        }
    }

    async function groupRemove() {
        try {
            await groupRemoveByName(group);
            navigation.navigate('groups');
        } catch (error) {
            Alert.alert('Remover Turma', 'Não foi possível remover a turma.');
        }
    }

    async function handleRemoveGroup() {
        Alert.alert(
            'Remover',
            'Deseja remover a turma?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => { groupRemove() } }
            ]
        );



    }

    useEffect(() => {
        fetchPlayersByTeam();
    }, [team]);


    return (
        <Container >
            <Header showBackButton />

            <Highlight
                title={group}
                subtitle="Adicione a galera e separe os times"
            />

            <Form>
                <Input
                    inputRef={newPlayerNameInputRef}
                    placeholder="Nome do player"
                    autoCorrect={false}
                    value={newPlayerName}
                    onChangeText={setNewPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />

                <ButtonIcon
                    icon='add'
                    onPress={handleAddPlayer}
                />
            </Form>

            <HeaderList>
                <FlatList
                    data={["TIME A", "TIME B"]}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        < Filter
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                />
                <NumberOfPlayers >
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>


            {
                isLoading ? <Loading /> :

                    <FlatList
                        data={players}
                        keyExtractor={item => item.name}
                        renderItem={({ item }) => (
                            <PlayerCard
                                name={item.name}
                                onRemove={() => handleRemovePlayer(item.name)}
                            />
                        )}
                        ListEmptyComponent={() => (
                            <ListEmpty
                                message="Não há players neste time"
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                            { paddingBottom: 100 },
                            players.length === 0 && { flex: 1 }
                        ]}
                    />
            }

            <Button
                title="Remover turma"
                type="SECONDARY"
                onPress={handleRemoveGroup}
            />

        </Container>
    );
}
