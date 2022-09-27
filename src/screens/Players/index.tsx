import { useState } from "react";
import { FlatList } from "react-native";

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";

export function Players() {
    const [team, setTeam] = useState('TIME A');
    // const [players, setPlayers] = useState(['Gleiton', 'Rafael', 'Mario', 'Marcio', 'Amanda', 'Ana']);
    const [players, setPlayers] = useState([]);

    return (
        <Container >
            <Header showBackButton />

            <Highlight
                title="Nome da turma"
                subtitle="Adicione a galera e separe os times"
            />

            <Form>
                <Input
                    placeholder="Nome da pessoa"
                    autoCorrect={false}
                />

                <ButtonIcon
                    icon='add'
                />
            </Form>

            <HeaderList>
                <FlatList
                    data={["TIME A", "TIME B", "TIME C", "TIME D", "TIME E", "TIME F", "TIME G", "TIME H"]}
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
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <PlayerCard
                        name={item}
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