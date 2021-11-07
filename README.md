# space

Explore wallet

Visit /:token_id for full screen

## Available Scripts

In the project directory, you can run:

### `yarn start`

## Raspberry cheat sheet

`./jour`
`./nuit`
`./run`

### Connect

`ping raspberrypi.local`
`ssh pi@192.168.1.49`

Update artwork:

### Service !

`sudo systemctl start art.service`
`sudo systemctl stop art.service`

### TV

`chromium-browser --noerrdialogs --kiosk https://open.spacelog.club/110635`

### $bash brightnes

`sudo bash -c "echo 0 > /sys/class/backlight/rpi_backlight/bl_power`

### brightness 0/1

`sudo nano /sys/class/backlight/rpi_backlight/brightness`

### Can call ./<file>

`sudo chmod +x <file>`

### Debug rotation

`export DISPLAY=:0.0`
`xhost +`
`DISPLAY=:0.0 hyperpixel4-rotate right`
