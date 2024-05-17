## Contenido

Este repositorio contiene ejemplos de Smart Contracts desarrollados en JavaScript, así como una implementación para front end utilizando HTML y JavaScript.

Para probar los contratos se requiere [NodeJs](https://nodejs.org/en/download/) y [NPM](https://docs.npmjs.com/cli/v7/configuring-npm/install/).

Además, es necesario instalar la `near-cli`

```sh
npm i -g near-cli
```

Puedes probar si tu instalación fue correcta utilizando el siguiente comando:

```sh
near state jimmymp1379.testnet
```

Por último, para poder hacer llamadas a los contratos desde tu terminal es necesario hacer login con el siguiente comando:

```sh
near login
```

Se abrirá una ventana del navegador donde podrás seleccionar tu wallet.

### JavaScript

* Código del contrato: `JavaScript/src/contract.ts`
* Cuenta pre-desplegada: `jimmymp1379.testnet`
Para más información del JavaScript ingresar al ReadMe de Javas