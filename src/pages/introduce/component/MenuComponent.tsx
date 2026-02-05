import styled from "styled-components";

interface MenuProps {
    select: string;
}

const MenuComponent = ({select} : MenuProps) => {
    return (
        <Container>
            <MenuButton>

            </MenuButton>

        </Container>
    );
}

export default MenuComponent;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const MenuButton = styled.button`
    color: #0A0A0A;
    font-size: 36px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;

    display: flex;
    padding: 18px 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    border-radius: 20px;
    background: #FFF;
`;
