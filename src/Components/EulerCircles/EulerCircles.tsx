import { useEffect } from "react";
import { Drawer } from "../../Helpers/Drawer";
import { TruthTable } from "../../Types/TruthTable";
import styles from "./EulerCircles.module.css";

interface IEulerCircles {
  table: TruthTable;
}

const EulerCircles = (props: IEulerCircles) => {
  const table = props.table;
  //const [count, setCount] = useState(4);

  useEffect(() => {
    if (table.variables.length !== 0) {
      resize();
    }
  }, [table]);

  function resize() {
    const canvas: HTMLCanvasElement = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    // resize the canvas to fill browser window dynamically
   // window.addEventListener("resize", resizeCanvas, false);

    function resizeCanvas() {
      //   canvas.width = window.innerWidth * 0.9;
      canvas.width = window.innerWidth * 0.7;
      canvas.height = window.innerHeight * 0.8;
      Drawer.draw(ctx!, table, canvas.width, canvas.height, 3);
    }
    resizeCanvas();
  }

  return (
    <div className={styles.container}>
      <canvas id="canvas" className={styles.drawField} />
    </div>
  );
};

export default EulerCircles;
