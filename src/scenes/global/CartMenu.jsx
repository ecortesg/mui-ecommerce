import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import styled from "@emotion/styled";
import { shades } from "../../theme";
import {
  decreaseCount,
  increaseCount,
  removeFromCart,
  setIsCartOpen,
} from "../../state/cartSlice";
import { useNavigate } from "react-router-dom";

const FlexBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export function CartMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const isCartOpen = useSelector((state) => state.cart.isCartOpen);

  const totalPrice = cart.reduce((total, product) => {
    return total + product.count * product.discounted_price;
  }, 0);

  return (
    // OVERLAY
    <Box
      display={isCartOpen ? "block" : "none"}
      backgroundColor="rgba(0, 0, 0, 0.4)"
      position="fixed"
      zIndex="20"
      width="100%"
      height="100%"
      left="0"
      top="0"
      overflow="auto"
    >
      {/* MODAL */}
      <Box
        position="fixed"
        right="0"
        bottom="0"
        width="max(400px, 30%)"
        height="100%"
        backgroundColor="white"
      >
        <Box padding="30px" overflow="auto" height="100%">
          {/* HEADER */}
          <FlexBox mb="15px">
            <Typography variant="h3">Shopping Cart ({cart.length})</Typography>
            <IconButton onClick={() => dispatch(setIsCartOpen({}))}>
              <CloseIcon />
            </IconButton>
          </FlexBox>
          {/* CART LIST */}
          <Box>
            {cart.map((product) => (
              <Box key={product.uuid}>
                <FlexBox p="15px 0">
                  <Box flex="1 1 40%">
                    <img
                      alt={product?.name}
                      width="123px"
                      height="164px"
                      src={product?.image}
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                  <Box flex="1 1 60%">
                    {/* PRODUCT NAME */}
                    <FlexBox mb="5px">
                      <Typography fontSize="bold">{product?.name}</Typography>
                      <IconButton
                        onClick={() =>
                          dispatch(removeFromCart({ uuid: product.uuid }))
                        }
                      >
                        <CloseIcon />
                      </IconButton>
                    </FlexBox>
                    {/* PRODUCT AMOUNT */}
                    <FlexBox m="15px 0">
                      <Box
                        display="flex"
                        alignItems="center"
                        border={`1.5px solid ${shades.neutral[500]}`}
                      >
                        <IconButton
                          onClick={() =>
                            dispatch(decreaseCount({ uuid: product.uuid }))
                          }
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography sx={{ p: "0 5px" }}>
                          {product.count}
                        </Typography>
                        <IconButton
                          onClick={() =>
                            dispatch(increaseCount({ uuid: product.uuid }))
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      {/* PRODUCT PRICE */}
                      <Typography fontWeight="bold">
                        ${product?.discounted_price}
                      </Typography>
                    </FlexBox>
                  </Box>
                </FlexBox>
                <Divider />
              </Box>
            ))}
          </Box>
          {/* ACTIONS */}
          <Box m="20px 0">
            <FlexBox m="20px 0">
              <Typography fontWeight="bold">TOTAL</Typography>
              <Typography fontWeight="bold">
                ${totalPrice.toFixed(2)}
              </Typography>
            </FlexBox>
            <Button
              disabled={cart.length > 0 ? false : true}
              sx={{
                backgroundColor: shades.primary[400],
                color: "white",
                borderRadius: 0,
                minWidth: "100%",
                padding: "20px 40px",
                m: "20px 0",
                "&:hover": { backgroundColor: shades.primary[500] },
                "&:disabled": { backgroundColor: shades.primary[100] },
              }}
              onClick={() => {
                navigate("/checkout");
                dispatch(setIsCartOpen({}));
              }}
            >
              CHECKOUT
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
