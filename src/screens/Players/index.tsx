import { useEffect, useState, useRef } from "react";
import { useRoute } from "@react-navigation/native";
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

type RouteParams = {
    group: string;
}

export function Players() {
    const [newPlayerName, setNewPlayerName] = useState('');
    const [team, setTeam] = useState('TIME A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

    const route = useRoute();
    const { group } = route.params as RouteParams;

    const newPlayerNameInputRef = useRef<TextInput>(null);

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
            const playersByTeam = await playersGetByGroupAndTeam(group, team);
            setPlayers(playersByTeam);
        } catch (error) {
            console.log(error);
            Alert.alert('Novo plyer', 'Não foi possível carregar jogadores.');
        }
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


            <FlatList
                data={players}
                keyExtractor={item => item.name}
                renderItem={({ item }) => (
                    <PlayerCard
                        name={item.name}
                        onRemove={() => { }}
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

            <Button
                title="Remover turma"
                type="SECONDARY"
            />

        </Container>
    );
}
