import {
  Actor,
  CollisionType,
  Color,
  DisplayMode,
  Engine,
  ImageFiltering,
  ImageSource,
  Loader,
  Sprite,
  SpriteSheet,
  vec,
} from "excalibur";
import { TiledResource } from "@excaliburjs/plugin-tiled";
import { useDialogStore } from "@/app/_components/state";
import { houseMessages } from "./flavorText";

const Resources = {
  PlayerPng: new ImageSource(
    "/resources/player.png",
    false,
    ImageFiltering.Pixel,
  ),
  HousePng: new ImageSource(
    "/resources/house.png",
    false,
    ImageFiltering.Pixel,
  ),
  tiledMap: new TiledResource("/resources/map.tmx", {
    entityClassNameFactories: {
      house: (props) => {
        const house = new House(
          props.worldPos,
          props.properties.get("houseid"),
        );
        return house;
      },
    },
  }),
};

const loader = new Loader();
for (const resource of Object.values(Resources)) {
  loader.addResource(resource);
}

const currentDay = 1;
export function startGame() {
  const game = new Engine({
    displayMode: DisplayMode.FitContainerAndFill,
    pixelArt: true,
    canvasElementId: "game",
    // backgroundColor: Color.White,
    backgroundColor: Color.fromHex("#0a0a0a"),
  });

  // game.toggleDebug();
  game.start(loader).then(() => {
    Resources.tiledMap.addToScene(game.currentScene);

    const player = new Player();
    game.add(player);

    game.currentScene.camera.strategy.lockToActor(player);
    // game.currentScene.camera.zoom = 1;
    game.input.pointers.primary.on("down", (even) => {
      console.log("click !");
      const worldPos = game.screenToWorldCoordinates(even.screenPos);

      player.moveToLocation(worldPos);
    });
  });

  return game;
}

class Player extends Actor {
  constructor() {
    super({
      x: 10,
      y: 150,
      z: 4,
      radius: 8,
      collisionType: CollisionType.Fixed,
      name: "Player",
    });
  }
  onInitialize() {
    const spriteSheet = SpriteSheet.fromImageSource({
      image: Resources.PlayerPng,
      grid: {
        rows: 1,
        columns: 16,
        spriteWidth: 16,
        spriteHeight: 16,
      },
    });
    this.graphics.use(spriteSheet.getSprite(0, 0));
  }

  moveToLocation(vec) {
    const isDialogOpen = useDialogStore.getState().showDialog;
    if (isDialogOpen) {
      return;
    }
    this.actions.moveTo(vec, 200);
  }
}

class House extends Actor {
  constructor(pos, houseId) {
    super({
      pos,
      anchor: vec(0, 0),
      z: 1,
      width: 48,
      height: 64,
      name: `house${houseId}`,
    });
    this.houseId = houseId;
  }
  onInitialize() {
    const sprite = new Sprite({
      image: Resources.HousePng,
      tint: this.houseId > currentDay ? Color.Gray : undefined,
      sourceView: {
        x: 16,
        y: 0,
        width: 48,
        height: 64,
      },
    });
    this.graphics.use(sprite);
    if (this.houseId > currentDay) {
    }
    this.on("pointerenter", () => {
      document.body.style.cursor = "pointer";
    });
    this.on("pointerleave", () => {
      document.body.style.cursor = "default";
    });
    this.on("collisionstart", (ev) => {
      if (ev.other instanceof Player && this.houseId <= currentDay) {
        ev.other.actions.clearActions();
        console.log("I hit ", ev);
        const texts = houseMessages[`house${this.houseId}`];
        console.log(texts);
        console.log(this.houseId);
        useDialogStore.getState().openDialog(texts, this.houseId);
      }
    });
  }
}
