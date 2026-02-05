import { useEffect, useRef } from "react";
import Matter from "matter-js";

interface Props {
    width: number;
    height: number;
}

const GravitySkillBalls = ({width, height} : Props) => {
    const sceneRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const {
            Engine,
            Render,
            World,
            Bodies,
            Mouse,
            MouseConstraint,
            Runner,
            Events,
        } = Matter;

        const engine = Engine.create();
        engine.gravity.y = 1;


        const render = Render.create({
            element: sceneRef.current!,
            engine,
            options: {
                width,
                height,
                wireframes: false,
                background: "transparent",
            },
        });

        // 벽
        const walls = [
            Bodies.rectangle(width / 2, -10, width, 20, { isStatic: true }),
            Bodies.rectangle(width / 2, height + 10, width, 20, { isStatic: true }),
            Bodies.rectangle(-10, height / 2, 20, height, { isStatic: true }),
            Bodies.rectangle(width + 10, height / 2, 20, height, { isStatic: true }),
        ];

        // 스킬 정의
        const skills = [
            { name: "React native", level: 14 },
            { name: "Android", level: 10 },
            { name: "React", level: 12 },
            { name: "Laravel", level: 5 },
            { name: "TypeScript", level: 7 },
            { name: "C++", level: 7 },
            { name: "Python", level: 6 },
            { name: "Figma", level: 6 },
            { name: "Notion", level: 6 },
            { name: "Arduino", level: 8 },
        ];

        const balls = skills.map((skill, index) => {
            const radius = 14 + skill.level * 6;
            return Bodies.circle(
                80 + index * 70,
                40,
                radius,
                {
                    restitution: 0.8,
                    density: 0.001 * skill.level,
                    render: {
                        fillStyle: "#ffffff",
                    },
                    label: skill.name, // 👈 텍스트용
                }
            );
        });

        World.add(engine.world, [...walls, ...balls]);

        // 드래그 (스프링 숨김)
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse,
            constraint: {
                stiffness: 0.15,
                render: {
                    visible: false, // 👈 초록색 선 제거
                },
            },
        });

        World.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        // 🔥 공 중앙 텍스트 렌더링
        Events.on(render, "afterRender", () => {
            const ctx = render.context;

            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            balls.forEach((ball) => {
                const radius = ball.circleRadius || 20;

                // 🔥 레벨이 클수록 글자도 커짐
                const fontSize = Math.max(12, radius * 0.35);

                ctx.font = `600 ${fontSize-5}px Pretendard, sans-serif`;

                ctx.fillText(
                    ball.label,
                    ball.position.x,
                    ball.position.y
                );
            });
        });

        Render.run(render);
        Runner.run(Runner.create(), engine);

        return () => {
            Render.stop(render);
            World.clear(engine.world, false);
            Engine.clear(engine);
            render.canvas.remove();
        };
    }, [width, height]);

    return <div ref={sceneRef} />;
};

export default GravitySkillBalls;
