import { useEffect, useRef } from "react";
import Matter from "matter-js";

// Matter.Mouse가 캔버스에 직접 붙이는 리스너들 — 공개 타입에는 없어서 보강
type MouseListeners = Record<"mousedown" | "mousemove" | "mouseup" | "mousewheel", (event: Event) => void>;

interface Skill {
    name: string;
    level: number; // 클수록 공과 글자가 커짐
}

interface Props {
    skills: Skill[];
    width: number;
    height: number;
}

const GravitySkillBalls = ({ skills, width, height }: Props) => {
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
            Query,
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

        // 컨테이너 너비에 맞춰 공 크기 조절 (데스크톱 기준 700px)
        const scale = Math.min(1, Math.max(0.5, width / 700));

        const balls = skills.map((skill, index) => {
            const radius = (14 + skill.level * 6) * scale;
            return Bodies.circle(
                (width / (skills.length + 1)) * (index + 1),
                40,
                radius,
                {
                    restitution: 0.8,
                    density: 0.001 * skill.level,
                    render: {
                        fillStyle: "#ffffff",
                    },
                    label: skill.name, // afterRender에서 공 위에 그림
                }
            );
        });

        World.add(engine.world, [...walls, ...balls]);

        // 드래그 (스프링 숨김)
        const mouse = Mouse.create(render.canvas) as Matter.Mouse & MouseListeners;
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse,
            constraint: {
                stiffness: 0.15,
                render: {
                    visible: false, // 드래그 시 연결선 숨김
                },
            },
        });

        World.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        // Matter.js 기본 리스너는 휠/터치 스크롤을 막으므로 교체
        // 휠은 페이지 스크롤에 맡기고, 터치는 공을 잡았을 때만 드래그로 처리
        const canvas = render.canvas;
        canvas.removeEventListener("wheel", mouse.mousewheel);
        canvas.removeEventListener("touchstart", mouse.mousedown);
        canvas.removeEventListener("touchmove", mouse.mousemove);
        canvas.removeEventListener("touchend", mouse.mouseup);

        let touchDragging = false;
        const onTouchStart = (event: TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const touch = event.changedTouches[0];
            const point = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
            touchDragging = Query.point(balls, point).length > 0;
            if (touchDragging) mouse.mousedown(event);
        };
        const onTouchMove = (event: TouchEvent) => {
            if (touchDragging) mouse.mousemove(event);
        };
        const onTouchEnd = (event: TouchEvent) => {
            if (!touchDragging) return;
            mouse.mouseup(event);
            touchDragging = false;
        };
        canvas.addEventListener("touchstart", onTouchStart, { passive: false });
        canvas.addEventListener("touchmove", onTouchMove, { passive: false });
        canvas.addEventListener("touchend", onTouchEnd, { passive: false });

        // 공 중앙 텍스트 렌더링
        Events.on(render, "afterRender", () => {
            const ctx = render.context;

            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            balls.forEach((ball) => {
                const radius = ball.circleRadius || 20;

                // 공이 클수록 글자도 커짐
                const fontSize = Math.max(9, radius * 0.35 - 5);

                ctx.font = `600 ${fontSize}px Pretendard, sans-serif`;

                ctx.fillText(
                    ball.label,
                    ball.position.x,
                    ball.position.y
                );
            });
        });

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        return () => {
            canvas.removeEventListener("touchstart", onTouchStart);
            canvas.removeEventListener("touchmove", onTouchMove);
            canvas.removeEventListener("touchend", onTouchEnd);
            Runner.stop(runner);
            Render.stop(render);
            World.clear(engine.world, false);
            Engine.clear(engine);
            render.canvas.remove();
        };
    }, [skills, width, height]);

    return <div ref={sceneRef} />;
};

export default GravitySkillBalls;
